import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { CiChat1 } from "react-icons/ci";
import Image from "next/image";
import hamOpen from "../assets/svgs/sidebarOpen.svg";
import hamClose from "../assets/svgs/sidebarClose.svg";
import logout from "../assets/svgs/logout.svg";
import "../styles/sidebar.css";
import { useGlobalContext } from "../hooks/context";

interface ListItem {
  id: number;
  name: string;
  location: string;
  // Add other properties as needed
}

const fetchData = (page: number, pageSize: number) => {
  const data = {
    items: [
      {
        id: 1,
        name: "Tell me about yourself",
        location: "Karnataka",
      },
      { id: 2, name: "What is your name", location: "Tamil Nadu" },
    ],
  };
  return data.items;
};

function Sidebar() {
  const { sideBarOpen, setSideBarOpen } = useGlobalContext();

  const showSidebar = () => setSideBarOpen(!sideBarOpen);

  return (
    <>
      <div onClick={showSidebar} className="absolute z-50 top-6 left-6">
        <Image src={sideBarOpen ? hamClose : hamOpen} alt="hamburger" />
      </div>
      <div className={sideBarOpen ? "newChat active" : "newChat"}>
        <FaPlus size={20} color="#7b7b7b" />
        <span className={sideBarOpen ? "" : "hidden"}>New Chat</span>
      </div>
      <nav className={sideBarOpen ? "sidebar active" : "sidebar"}>
        <div className="flex flex-col items-center justify-center">
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
        className="absolute z-50 cursor-pointer bottom-20 left-6"
      >
        <Image src={logout} alt="logout" />
      </div>
    </>
  );
}

interface PaginationProps {
  pageSize: number;
}

const Pagination: React.FC<PaginationProps> = ({ pageSize }) => {
  const [items, setItems] = useState<ListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDataAndUpdateState = async () => {
      setLoading(true);
      const data = fetchData(currentPage, pageSize);
      setItems((prevItems) => [...prevItems, ...data]);
      setLoading(false);
    };

    fetchDataAndUpdateState();
  }, [currentPage, pageSize]);

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    items.length > 0 && (
      <div className="mx-6">
        <div className="text-lg mb-4 font-bold text-[#565656]">Recent</div>
        <ul className=" max-h-[400px] overflow-auto">
          {items.map((item, index) => (
            <li
              className="flex relative items-center max-w-48 mb-2 text-[#455a64] py-2 px-6 gap-2 chat-bg rounded-[40px]"
              key={index}
            >
              <CiChat1 size={24} color="#455a64" />
              <div className="w-full mb-1 overflow-hidden overflow-ellipsis whitespace-nowrap break-keep">
                {item.name}
              </div>
              <div className="absolute top-7 right-3 text-[11px]">
                {item.location}
              </div>
            </li>
            // Render other properties as needed
          ))}
        </ul>
        {loading && <p>Loading...</p>}
        {!loading && (
          <button
            className="text-red-saathi font-bold py-2 px-4 bg-[#dbdbdb] rounded-[40px] my-2"
            onClick={handleLoadMore}
            disabled={loading}
          >
            Load More
          </button>
        )}
      </div>
    )
  );
};

export default Sidebar;
