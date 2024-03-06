import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "../../../../client/client";
import { getAccessToken } from "@auth0/nextjs-auth0";

export async function POST(req: NextRequest, res: NextApiResponse) {
  const { accessToken } = await getAccessToken({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: process.env.AUTH0_SCOPE,
    },
  });

  console.log("Called POST /api/v2/create-user");
  try {
    const res = await axiosInstance.post(
      "/api/v2/user/",
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
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
}
