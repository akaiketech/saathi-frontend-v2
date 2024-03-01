import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "../../../../client/client";
import { getAccessToken } from "@auth0/nextjs-auth0";

export async function POST(req: NextRequest, res: NextApiResponse) {
  const reqBody = await req.json();
  const { accessToken } = await getAccessToken({});

  try {
    const response = await axiosInstance.post("/api/v1/query", reqBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) {
      return NextResponse.json(response.data);
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
