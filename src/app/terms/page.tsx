"use client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { ChatProvider } from "../chat/context/ChatContext";
import TnCPage from "./TnCPage";

const Terms = () => {
  return (
    <ChatProvider>
      <TnCPage />
    </ChatProvider>
  );
};

export default withPageAuthRequired(Terms);
