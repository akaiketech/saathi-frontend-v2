import { getAccessToken } from "@auth0/nextjs-auth0";
import axiosInstance from "../client/client";

// export const acceptUserTnC = async () => {
//   const { accessToken } = await getAccessToken({
//     authorizationParams: {
//       audience: process.env.AUTH0_AUDIENCE,
//       scope: process.env.AUTH0_SCOPE,
//     },
//   });
//   return await 
//     axiosInstance.post(
//     "/api/v1/user/accept-terms",
//     {},
//     { headers: { Authorization: `Bearer ${accessToken}` } },
//   );
// };


export const acceptUserTnC = async () => {
  const res = await fetch("/api/v1/terms-update", { method: "POST" });

  console.log(res);

  if (!res.ok) {
    const errorText = `Failed to fetch the result.`;
    return { data: null, error: errorText };
  }

  if (res.status === 200) {
    const data = await res.json();
    return { data, error: null };
  }

  return { data: null, error: "Unknown error occurred" };
};

export const checkUserTnCStatus = async () => {
  const res = await fetch("/api/v1/terms-status", { method: "POST" });

  if (!res.ok) {
    const errorText = `Failed to fetch the result.`;
    return { data: null, error: errorText };
  }

  if (res.status === 200) {
    const data = await res.json();
    return { data, error: null };
  }

  return { data: null, error: "Unknown error occurred" };
};
