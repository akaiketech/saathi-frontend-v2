import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const { accessToken } = await getAccessToken({
      authorizationParams: {
        audience: process.env.AUTH0_AUDIENCE,
        scope: process.env.AUTH0_SCOPE,
      },
    });
    return NextResponse.json({
      accessToken,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
