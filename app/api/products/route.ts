import { NextResponse } from "next/server";
import { mockProducts } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockProducts,
    message: "Products fetched successfully",
  });
}
