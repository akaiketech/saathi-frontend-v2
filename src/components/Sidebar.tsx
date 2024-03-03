import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { CiChat1 } from "react-icons/ci";
import Image from "next/image";
import hamOpen from "../assets/svgs/sidebarOpen.svg";
import hamClose from "../assets/svgs/sidebarClose.svg";
import logout from "../assets/svgs/logout.svg";
import "../styles/sidebar.css";
import { useGlobalContext } from "../hooks/context";
import { getConversationMsgs, getConversations } from "../services";
import { toast } from "react-toastify";
import { useChatContext } from "../app/chat/context/ChatContext";
import { Message } from "../types";

interface Conversation {
  conversation_id: string;
  conversation_title: string;
  conversation_location: string;
  conversation_language: string;
  // Add other properties as needed
}

const fetchData = async (page: number, page_size: number) => {
  const conversations = await getConversations({ page, page_size });

  if (conversations.error) {
    toast.error(conversations.error, {
      autoClose: 5000,
      position: "top-right",
    });

    return {
      error: conversations.error,
      data: null,
    };
  } else {
    return {
      error: null,
      data: conversations.data,
    };
  }
};

const handleNewChat = () => {
  window.location.href = "/chat";
};

function Sidebar() {
  const { sideBarOpen, setSideBarOpen } = useGlobalContext();

  const showSidebar = () => setSideBarOpen(!sideBarOpen);

  return (
    <>
      <div onClick={showSidebar} className="z-50 absolute top-6 left-6">
        <Image src={sideBarOpen ? hamClose : hamOpen} alt="hamburger" />
      </div>
      <div
        onClick={handleNewChat}
        className={sideBarOpen ? "newChat active" : "newChat"}
      >
        <FaPlus size={20} color="#7b7b7b" />
        <span className={sideBarOpen ? "" : "hidden"}>New Chat</span>
      </div>
      <nav className={sideBarOpen ? "sidebar active" : "sidebar"}>
        <div className="flex flex-col items-center mt-48 md:mt-64">
          <div
            className={
              sideBarOpen
                ? "opacity-100 transition-all duration-150"
                : "opacity-0 transition-all duration-150"
            }
          >
            <Pagination pageSize={5} />
          </div>
        </div>
      </nav>
      <div
        onClick={() => (window.location.href = "/api/auth/logout")}
        className={`absolute flex gap-3 items-center z-50 cursor-pointer bottom-10 left-6 ${
          sideBarOpen ? "logout active" : "logout"
        }`}
      >
        <Image className="w-auto h-12" src={logout} alt="logout" />
        <span className="flex md:hidden text-[16px] text-[#7b7b7b] font-medium">
          Logout
        </span>
      </div>
    </>
  );
}

interface PaginationProps {
  pageSize: number;
}

const Pagination: React.FC<PaginationProps> = ({ pageSize }) => {
  const [conv, setConv] = useState<Conversation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allFetched, setAllFetched] = useState(false);
  const {location, language,sessionId, setSessionId, setSideBarOpen, setLocation, setLanguage } =
    useGlobalContext();
  const { setMessages } = useChatContext();

  const setMessageResponse = (messsageObjList: any[], conversation_id: string) => {
    const newMessages = messsageObjList.map((messageObj) => {
      const {
        query_id,
        english_query,
        english_response,
        language_query,
        feedback,
        language_response,
      } = messageObj;

      const mesgConv = conv.find((conv) => conv.conversation_id === conversation_id);

      const questionObj = {
        englishText: english_query,
        hindiText: "",
        kannadaText: "",
        tamilText: "",
        audio: "",
      };

      let answer = english_response;

      if (mesgConv) {
        switch (mesgConv?.conversation_language.toLowerCase()) {
          case "hindi":
            questionObj.hindiText = language_query;
            answer = language_response;
            break;

          case "kannada":
            questionObj.kannadaText = language_query;
            answer = language_response;
            break;

          case "tamil":
            questionObj.tamilText = language_query;
            answer = language_response;
            break;
        }
      }

      return {
        id: query_id,
        question: questionObj,
        answer,
        isLoading: false,
        vote: feedback,
      };
    });

    return newMessages;
  };

  const openConversation = async (
    conversation_id: string,
    conversationLocation: string,
    conversationLanguage: string,
  ) => {
    try {
      const res = await getConversationMsgs({
        conversation_id,
        page: 1,
        page_size: 10,
      });

      setSideBarOpen(false);
      setSessionId(conversation_id);
      setLocation(conversationLocation);
      setLanguage(conversationLanguage);

      if (res.error) {
        toast.error(res.error, {
          autoClose: 5000,
          position: "top-right",
        });
        return;
      }

      if (res.data.paginated_messages) {
        const newMsg = setMessageResponse(res.data.paginated_messages, conversation_id);
        setMessages(newMsg as Message[]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchDataAndUpdateState = async () => {
      try {
        setLoading(true);
        const data = await fetchData(currentPage, pageSize);
        if (data.data.conversations.length === 0) {
          setAllFetched(true);
        }
        setConv([...conv, ...(data.data.conversations as Conversation[])]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndUpdateState();
  }, [currentPage, pageSize]);

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    conv?.length > 0 && (
      <div className="mx-6">
        <div className="text-lg mb-4 font-bold text-[#565656]">Recent</div>
        <ul className="max-h-[calc(100vh-440px)] md:max-h-[calc(100vh-400px)] overflow-auto">
          {conv.map((item, index) => (
            <li
              onClick={() =>
                openConversation(
                  item.conversation_id,
                  item.conversation_location,
                  item.conversation_language,
                )
              }
              className="flex relative items-center max-w-52 mb-2 text-[#455a64] py-2 px-6 gap-2 chat-bg rounded-[40px]"
              key={index}
            >
              <CiChat1 size={24} color="#455a64" />
              <div className="w-full mb-1 overflow-hidden overflow-ellipsis whitespace-nowrap break-keep">
                {item.conversation_title}
              </div>
              <div className="absolute top-7 right-3 text-[11px]">
                {item.conversation_location}
              </div>
            </li>
          ))}
        </ul>
        {loading && <p>Loading...</p>}
        {!loading && (
          <button
            className={`text-red-saathi font-medium py-2 px-4 bg-[#dbdbdb] rounded-[40px] my-2 ${
              allFetched ? "pointer-events-none opacity-50" : ""
            }`}
            onClick={handleLoadMore}
            disabled={loading || allFetched}
          >
            {allFetched ? "All Fetched" : "Load More"}
          </button>
        )}
      </div>
    )
  );
};

export default Sidebar;
