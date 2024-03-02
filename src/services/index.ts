export const acceptUserTnC = async () => {
  const res = await fetch("/api/v1/terms-update", { method: "POST" });

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

export const getConversations = async ({
  page,
  page_size,
}: {
  page: number;
  page_size: number;
}) => {
  console.log(page, page_size);
  const res = await fetch("/api/v1/get-conv", {
    method: "POST",
    body: JSON.stringify({ page, page_size }),
  });
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
