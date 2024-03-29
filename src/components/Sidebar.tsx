import React, { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { CiChat1 } from "react-icons/ci";
import Image from "next/image";
import hamOpen from "../assets/svgs/sidebarOpen.svg";
import hamClose from "../assets/svgs/sidebarClose.svg";
import logout from "../assets/svgs/logout.svg";
import homeBtn from "../assets/svgs/Homebutton.svg";
import "../styles/sidebar.css";
import { useGlobalContext } from "../hooks/context";
import { getConversations } from "../services";
import { toast } from "react-toastify";
import { useChatContext } from "../app/chat/context/ChatContext";
import { Conversation } from "../types";

import { useRouter } from "next/navigation";

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

const scrollToTop = (containerRef: any, options = {} as any) => {
  // Check if the containerRef is valid
  if (!containerRef.current) {
    console.warn("Container reference not found", containerRef);
    return;
  }

  // Options:
  const behavior = options.behavior || "smooth"; // Default: smooth scrolling
  const top = options.top || 0; // Default: scroll to the top

  containerRef.current.scrollTo({
    top,
    behavior,
  });
};

function Sidebar() {
  const router = useRouter();
  const { sideBarOpen, setPrefModal, setSideBarOpen } = useGlobalContext();
  const handleNewChat = () => {
    setPrefModal(true);
    setSideBarOpen(false);
  };

  const showSidebar = () => setSideBarOpen(!sideBarOpen);

  return (
    <>
      <div
        onClick={showSidebar}
        className="z-50 absolute top-6 md:top-8 left-6 cursor-pointer"
      >
        <Image src={sideBarOpen ? hamClose : hamOpen} alt="hamburger" />
      </div>
      <div
        onClick={() => router.replace("/preferences")}
        className="z-50 absolute top-24 left-6 hidden cursor-pointer md:block active:scale-95 transition-all duration-150"
      >
        <Image src={homeBtn} alt="homeBtn" />
      </div>
      <div
        onClick={handleNewChat}
        className={sideBarOpen ? "newChat active" : "newChat"}
      >
        <FaPlus size={20} color="#7b7b7b" />
        <span
          className={`overflow-ellipsis whitespace-nowrap overflow-x-hidden ${
            sideBarOpen ? "block" : "hidden"
          }`}
        >
          New Chat
        </span>
      </div>
      <nav className={sideBarOpen ? "sidebar active" : "sidebar"}>
        <div className="flex flex-col items-center mt-48 md:mt-64">
          <div className={sideBarOpen ? "opacity-100" : "hidden"}>
            <Pagination pageSize={5} />
          </div>
        </div>
      </nav>
      <div
        onClick={() => (window.location.href = "/api/auth/logout")}
        className={`absolute flex gap-3 items-center z-50 rounded-full cursor-pointer bottom-10 left-6 bg-[#dbdbdb] active:bg-[#bebcbc] transition-all duration-300 ${
          sideBarOpen ? "logout active" : "logout"
        }`}
      >
        <Image className="w-auto h-10" src={logout} alt="logout" />
        <span className="flex overflow-ellipsis overflow-x-hidden text-[16px] text-[#7b7b7b] font-medium">
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
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allFetched, setAllFetched] = useState(false);
  const { sessionId } = useGlobalContext();
  const { conv, setConv, setIsRecentConv, setPageNumber, openConversation } =
    useChatContext();
  const [scroll, setScroll] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    scrollToTop(containerRef);
  }, [scroll]);

  const fetchDataAndUpdateState = async () => {
    try {
      setLoading(true);
      const data = await fetchData(currentPage, pageSize);
      if (data.data.conversations.length === 0) {
        setAllFetched(true);
      }
      setConv([...conv, ...(data.data.conversations as Conversation[])]);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataAndUpdateState();
  }, [currentPage, pageSize]);

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    conv.length > 0 && (
      <div className="mx-3">
        <div className="text-lg mb-4 ml-3 font-bold text-[#565656]">Recent</div>
        <ul
          ref={containerRef}
          className="max-h-[calc(100vh-440px)] md:max-h-[calc(100vh-450px)] py-1 overflow-auto"
        >
          {conv.map((item, index) => (
            <li
              onClick={() => {
                openConversation(
                  item.conversation_id,
                  item.conversation_location,
                  item.conversation_language,
                );
                fetchDataAndUpdateState();
                setScroll(!scroll);
                setIsRecentConv(true);
                setPageNumber(1);
              }}
              className={`flex relative items-center max-w-52 mb-2 ring-2 text-[#455a64] ring-[#ff725e] py-2 px-6 mx-1 gap-2 rounded-[40px] cursor-pointer active:scale-95 transition-all duration-150 ${
                item.conversation_id === sessionId ? "chat-bg" : ""
              }`}
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
        {loading && (
          <div className="flex justify-center my-4">
            <span>Loading...</span>
          </div>
        )}
        {!loading && (
          <button
            className={`text-[#7b7b7b] font-medium py-2 px-4 bg-[#dbdbdb] rounded-[40px] my-2 ${
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
