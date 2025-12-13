import { NextResponse } from "next/server";
import { mockDesigns } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockDesigns,
    message: "Designs fetched successfully",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Mock save operation
    const newDesign = {
      id: `design-${Date.now()}`,
      userId: "user-1",
      ...body,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: newDesign,
        message: "Design saved successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save design",
      },
      { status: 500 }
    );
  }
}
