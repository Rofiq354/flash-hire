import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/services/auth/user.service";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { full_name, job_title, phone_number, location, country } = body;

    const updatedProfile = await prisma.profiles.update({
      where: { id: user.id },
      data: {
        full_name,
        job_title,
        phone_number,
        location,
        country,
      },
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
