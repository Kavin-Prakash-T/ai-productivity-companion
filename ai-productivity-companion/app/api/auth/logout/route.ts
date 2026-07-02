import { successResponse } from "@/utils/apiResponse";

export async function POST() {
  return successResponse("Logout successful. Please remove token from client.");
}