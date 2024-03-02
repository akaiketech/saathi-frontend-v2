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

  console.log(reqBody)
  console.log("Called POST /api/v1/get-conv-msgs");
  try {
    const res = await axiosInstance.post(
      "/api/v1/user/conversation/messages",
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );


    // const res = {
    //   status: 200,
    //   data: {
    //     paginated_messages: [
    //       {
    //         query_id: "f291c270-20bc-4f03-9fb7-e59884d7c52b",
    //         created_at: "2024-03-02T09:07:41.089000",
    //         updated_at: "2024-03-02T09:07:41.089000",
    //         user_audio:
    //           "http://minio:9000//saathi-melinda-gates/sessions_v2_dev/sms|65ddf2f56ae919be22d9b04c/99cbef2a-cf8c-4c36-9b30-b3aa9133e799/2024-03-02_09-07-37.wav",
    //         language_query: "Hellooo",
    //         language_response:
    //           "! आज मैं आपकी कैसे सहायता कर सकता हूं? यदि आपके पास सरकारी योजनाओं के बारे में कोई प्रश्न हैं, तो बेझिझक पूछें!",
    //         english_query: "Hellooo",
    //         english_response:
    //           "! How can I assist you today? If you have any questions about government schemes, feel free to ask!",
    //         feedback: 0,
    //       },
    //       {
    //         query_id: "8b0190e4-2aa9-4d33-9e99-779a8ed1d14a",
    //         created_at: "2024-03-02T09:07:29.555000",
    //         updated_at: "2024-03-02T09:07:29.555000",
    //         user_audio:
    //           "http://minio:9000//saathi-melinda-gates/sessions_v2_dev/sms|65ddf2f56ae919be22d9b04c/99cbef2a-cf8c-4c36-9b30-b3aa9133e799/2024-03-02_09-07-24.wav",
    //         language_query: "Hello world",
    //         language_response:
    //           "मुझे क्षमा करें, मुझे आपकी क्वेरी के लिए कोई प्रासंगिक जानकारी नहीं मिली। क्या आप कृपया अधिक विवरण प्रदान कर सकते हैं या अपने प्रश्न को फिर से लिख सकते हैं?",
    //         english_query: "Hello world",
    //         english_response:
    //           "I'm sorry, I couldn't find any relevant information for your query. Can you please provide more details or rephrase your question?",
    //         feedback: 0,
    //       },
    //     ],
    //     total_messages: 2,
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
