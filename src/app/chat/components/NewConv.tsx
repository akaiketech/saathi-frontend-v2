"use client";
import moment from "moment";
import { IoLanguage } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";

import { Conversation } from "../../../types";
import { useChatContext } from "../context/ChatContext";
import animationData from "../../../lottie/loading.json";
import Lottie from "react-lottie";

type Props = {
  isNewUser: boolean;
  conversations: Conversation[];
};

const NewConv = ({ isNewUser, conversations }: Props) => {
  const { isLoading, openConversation } = useChatContext();
  const defaultOptionsForLoading = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return !isLoading ? (
    <div className="flex flex-col md:ml-10 h-full text-2xl text-black bg-red">
      <h1 className="chat-heading text-[24px] md:text-[46px]">
        Namaste, {isNewUser ? "Welcome to SAATHI" : "Welcome back!"}
      </h1>
      <h3 className="text-[#b3b3b3] mt-4 font-medium text-xl md:text-4xl">
        How can I help you today?
      </h3>

      <div className="mt-6 md:mt-10">
        {conversations.length > 0 && (
          <p className="text-[#455a64] text-sm md:text-xl">
            Want to continue your last conversation?
          </p>
        )}
        <div className="flex flex-col md:flex-row gap-2">
          {conversations.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                openConversation(
                  item.conversation_id,
                  item.conversation_location,
                  item.conversation_language,
                );
              }}
              className="md:w-[48%] cursor-pointer mt-3 md:mt-6 bg-[#e9e9e9] rounded-2xl md:rounded-3xl px-2 md:px-4 pb-4"
            >
              <p className="text-[8px] md:text-[10px] text-end text-[#455a64]">
                {moment(item.created_at).format("DD MMMM YYYY")}
              </p>
              <h2 className="text-2xl overflow-x-hidden w-full text-[#ff725e] font-bold -mt-2 overflow-ellipsis whitespace-nowrap">
                {item.conversation_title}
              </h2>

              <div className="flex justify-between">
                <div className="flex gap-1 items-center text-[12px] md:text-sm text-[#455a64]">
                  <IoLanguage
                    size={18}
                    color="#ff725e"
                    className="w-4 md:w-6"
                  />
                  {item.conversation_language}
                </div>
                <div className="flex gap-1 items-center text-[12px] md:text-sm text-[#455a64]">
                  <IoLocationOutline
                    size={18}
                    color="#ff725e"
                    className="w-4"
                  />
                  {item.conversation_location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div>
      <Lottie options={defaultOptionsForLoading} height={200} width={200} />
    </div>
  );
};

export default NewConv;
