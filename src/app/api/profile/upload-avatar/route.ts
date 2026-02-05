import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("avatar") as File;

    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("cv-files")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("cv-files").getPublicUrl(filePath);

    await prisma.profiles.update({
      where: { id: user.id },
      data: { avatar_url: publicUrl },
    });

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
