"use server";

import { createClient as createSupabaseClient } from "@/utils/supabase/server";
import { GoogleGenAI as createGeminiClient } from "@google/genai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function uploadAndAnalyzeCV(formData: FormData) {
  const supabase = createSupabaseClient();
  const file = formData.get("cv") as File;

  if (!file) {
    throw new Error("No file provided");
  }

  // ambil data user untuk penamaan file yang unik
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;
  const filePath = `resume/${fileName}`;

  // Upload ke Supabase Storage (Bucket: cv-files)
  const { error: uploadError } = await supabase.storage
    .from("cv-files")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Upload Error:", uploadError.message);
    throw new Error("Failed to upload CV");
  }

  // Dapatkan Public URL untuk disimpan di database
  const {
    data: { publicUrl },
  } = supabase.storage.from("cv-files").getPublicUrl(filePath);

  console.log("File berhasil diupload ke:", publicUrl);

  /* LOGIC GENERATE PDF TO GEMINI ------------------------------------------------- */

  try {
    const client = new createGeminiClient({
      apiKey: process.env.GEMINI_API_KEY as string,
      apiVersion: "v1",
    });

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `Extract professional information from this CV into a clean JSON object. 
                      Follow these strict rules:
                      1. Return ONLY a valid JSON object.
                      2. Do NOT include markdown formatting like \`\`\`json or any introductory text.
                      3. Format the data as follows:
                        - "skills": An array of strings (e.g., ["React", "TypeScript", "Node.js"]).
                        - "experience": An array of objects with keys: "company" (string), "role" (string), "duration" (string, e.g., "2020 - 2022").
                        - "education": An array of objects with keys: "institution" (string), "degree" (string), "year" (string).
                        - "summary": A concise professional summary (minimum 2 sentences).

                      If a field is not found in the CV, use an empty array [] or an empty string "" instead of null.`;

    // Panggil Gemini 1.5 Flash (Model paling cepat untuk baca dokumen)
    // Di SDK baru, metodenya langsung lewat client.models.generateContent
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${prompt}`,
            },
            {
              inlineData: {
                data: base64Data,
                mimeType: "application/pdf",
              },
            },
          ],
        },
      ],
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("AI did not return any text");

    // Bersihkan backticks ```json ... ```, dari gemini
    const cleanJson = text.replace(/```json|```/g, "").trim();
    // console.log(cleanJson);
    const parsedData = JSON.parse(cleanJson);

    const { error: dbError } = await supabase.from("cvs").upsert(
      {
        user_id: user.id, // Sesuai kolom user_id @db.Uuid
        file_url: publicUrl, // Kolom file_url String
        full_name: parsedData.full_name || user.user_metadata.full_name,
        email: parsedData.email || user.email,
        skills: parsedData.skills, // Kolom skills String[]
        // Karena skema kamu pake String? untuk summary, kita gabungkan array-nya
        experience_summary: JSON.stringify(parsedData.experience),
        education_summary: JSON.stringify(parsedData.education),
        parsed_json: parsedData, // Simpan mentahnya di kolom parsed_json
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    ); // Biar user cuma punya 1 data CV aktif (opsional)

    if (dbError) throw dbError;

    return {
      success: true,
      data: parsedData,
      message: "CV analyzed successfully!",
    };
  } catch (error: any) {
    console.error("New Gemini SDK Error:", error);
    throw new Error(error.message || "Failed to analyze CV");
  }
}

// File uploaded successfully. Starting AI analysis...
