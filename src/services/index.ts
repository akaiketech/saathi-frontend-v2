import { toast } from "react-toastify";

export const acceptUserTnC = async () => {
  const res = await fetch("/api/v2/terms-update", { method: "POST" });

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
  const res = await fetch("/api/v2/terms-status", { method: "GET" });

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

export const getConversations = async ({
  page,
  page_size,
}: {
  page: number;
  page_size: number;
}) => {
  const res = await fetch(
    `/api/v2/get-conv?page=${page}&page_size=${page_size}`,
    {
      method: "GET",
    },
  );
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

export const createUser = async () => {
  try {
    const res = await fetch("/api/v2/create-user", { method: "POST" });
    if (!res.ok) {
      const errorText = `Failed to fetch the result.`;
      return { data: null, error: errorText };
    }
    if (res.status === 200) {
      const data = await res.json();
      return { data, error: null };
    }
    toast.error("Failed to create user.");
    return { data: null, error: "Unknown error occurred" };
  } catch (error) {
    toast.error("Failed to create user.");
    const errorText = `Failed to create user.`;
    return { data: null, error: errorText };
  }
};

export const getConversationMsgs = async ({
  conversation_id,
  page,
  page_size,
}: any) => {
  const res = await fetch(
    `/api/v2/get-conv-msgs?conversation_id=${conversation_id}&page=${page}&page_size=${page_size}`,
    {
      method: "GET",
    },
  );

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
