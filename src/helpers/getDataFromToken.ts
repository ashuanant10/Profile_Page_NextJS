import { NextResponse } from "next/server";
import Jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextResponse) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decodedToken: any = Jwt.verify(token, process.env.TOKEN_SECRET!);
    return decodedToken.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
