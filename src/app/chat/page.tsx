"use client";

import React, { useEffect, useRef } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { ChatProvider } from "./context/ChatContext";
import ChatHome from "./ChatHome";
import PreferenceForm from "../../components/PreferenceForm";
import { useGlobalContext } from "../../hooks/context";

const ChatPage = () => {
  const { prefModal, setPrefModal } = useGlobalContext();
  const modalRef = useRef<any>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(event.target)
    ) {
      setPrefModal(false);
    }
  };


  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalRef]);

  return (
    <ChatProvider>
      <ChatHome />
      <div
        ref={modalRef}
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] bg-white rounded-2xl p-10 md:px-4 md:pb-20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${
          !prefModal && "hidden"
        }`}
      >
        <PreferenceForm isModal={true} />
      </div>
    </ChatProvider>
  );
};

export default withPageAuthRequired(ChatPage);
