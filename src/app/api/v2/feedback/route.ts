import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "../../../../client/client";
import { getAccessToken } from "@auth0/nextjs-auth0";

export const PUT = async (req: NextRequest) => {
  const { accessToken } = await getAccessToken({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: process.env.AUTH0_SCOPE,
    },
  });

  console.log("\nEntering PUT /api/v2/feedback");

  try {
    const reqBody = await req.json();
    const res = await axiosInstance.put(
      "/api/v2/user/conversation/message/feedback/",
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (res.status === 200) {
      return NextResponse.json(res.data);
    } else {
      const errorText = `Failed to fetch the result.`;
      return NextResponse.json({ error: errorText });
    }
  } catch (error: any) {
    if (error.response) {
      const errorText = `Failed to fetch the result.`;
      return NextResponse.json({ error: errorText });
    } else {
      return NextResponse.json(
        { error: "Unknown error occurred" },
        { status: 500 },
      );
    }
  }
};
