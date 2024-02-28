"use client";

import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { ChatProvider } from "./context/ChatContext";
import ChatHome from "./ChatHome";

const ChatPage = () => {
  return (
    <ChatProvider>
      <ChatHome />
    </ChatProvider>
  );
};

export default withPageAuthRequired(ChatPage);
