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

  const reqBody = await req.json();

  console.log("Called POST /api/v1/get-conv");
  try {
    const res = await axiosInstance.post(
      "/api/v1/user/conversations",
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    // const res = {
    //   status: 200,
    //   data: {
    //     conversations: [
    //       {
    //         conversation_id: "1a3fd85e-2100-4694-851e-03217bb1bc6f",
    //         conversation_title: '"How are you?"',
    //         conversation_language: "English",
    //         conversation_location: "Karnataka",
    //         created_at: "2024-03-01T21:53:31.185000",
    //       },
    //       {
    //         conversation_id: "3f2d5586-f78d-4504-995c-d4798ffe1f00",
    //         conversation_title: "Invalid Input",
    //         conversation_language: "English",
    //         conversation_location: "Karnataka",
    //         created_at: "2024-03-01T21:04:49.912000",
    //       },
    //       {
    //         conversation_id: "9e512cc4-4aaf-491c-9462-2de772bef8e4",
    //         conversation_title: "अमान्य इनपुट",
    //         conversation_language: "Hindi",
    //         conversation_location: "Madhya Pradesh",
    //         created_at: "2024-03-01T20:52:07.086000",
    //       },
    //       {
    //         conversation_id: "56140dc6-87df-400b-a8f8-59aabf17a58c",
    //         conversation_title: "अमान्य इनपुट",
    //         conversation_language: "Hindi",
    //         conversation_location: "Madhya Pradesh",
    //         created_at: "2024-03-01T18:30:41.733000",
    //       },
    //       {
    //         conversation_id: "9019b908-010a-4ef6-95e5-81f3a85cc7db",
    //         conversation_title: "ಶುಭಾಶಯ ಶಿಷ್ಟಾಚಾರ",
    //         conversation_language: "Kannada",
    //         conversation_location: "Karnataka",
    //         created_at: "2024-03-01T13:42:34.043000",
    //       },
    //       {
    //         conversation_id: "b25cb98c-b9f4-4034-8b59-7ec02a3a1a5a",
    //         conversation_title: "अभिवादन शिष्टाचार",
    //         conversation_language: "Hindi",
    //         conversation_location: "Madhya Pradesh",
    //         created_at: "2024-03-01T10:49:15.588000",
    //       },
    //       {
    //         conversation_id: "d24f1030-f91c-4c2f-a1a1-bfdc454c6c90",
    //         conversation_title: "अभिवादन शिष्टाचार",
    //         conversation_language: "Hindi",
    //         conversation_location: "Madhya Pradesh",
    //         created_at: "2024-03-01T10:15:29.693000",
    //       },
    //       {
    //         conversation_id: "10c818ac-d5a7-4258-a532-54bb9b75b6af",
    //         conversation_title: "ಶುಭಾಶಯ ವಿಚಾರಣೆ",
    //         conversation_language: "Kannada",
    //         conversation_location: "Karnataka",
    //         created_at: "2024-03-01T10:15:01.639000",
    //       },
    //     ],
    //     total_conversations: 8,
    //   },
    // };

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
