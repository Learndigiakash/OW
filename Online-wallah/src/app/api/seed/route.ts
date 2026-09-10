import { NextResponse } from "next/server";
import { runSeed } from "@/db/seed";

export async function POST() {
  try {
    await runSeed();
    return NextResponse.json({ success: true, message: "Database seeded successfully" });
  } catch (error: any) {
    console.error("Seed route error:", error);
    return NextResponse.json({ error: "Failed to seed", details: error.message }, { status: 500 });
  }
}
