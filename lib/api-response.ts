import { NextResponse } from "next/server";

// Common API Response Type
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Helper function to create success response
export function successResponse<T>(
  data: T,
  message: string = "Success"
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    message,
    data,
  });
}

// Helper function to create error response
export function errorResponse(
  message: string,
  statusCode: number = 400
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: statusCode }
  );
}

// Helper function to handle API errors
export function handleApiError(error: any): NextResponse<ApiResponse> {
  console.error("API Error:", error);

  if (error.name === "ZodError") {
    return errorResponse("Validation error: " + error.message, 400);
  }

  return errorResponse(
    error.message || "Internal server error",
    error.statusCode || 500
  );
}
