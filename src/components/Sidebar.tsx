import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { CiChat1 } from "react-icons/ci";
import Image from "next/image";
import hamOpen from "../assets/svgs/sidebarOpen.svg";
import hamClose from "../assets/svgs/sidebarClose.svg";
import "../styles/sidebar.css";

interface ListItem {
  id: number;
  name: string;
  location: string;
  // Add other properties as needed
}

const fetchData = (page: number, pageSize: number) => {
  // Implement your data fetching logic here (e.g., fetch from an API)
  // Return a promise that resolves to an array of items for the specified page and pageSize
  // For simplicity, this example returns dummy data
  // const response = await fetch(
  //   `https://api.example.com/data?page=${page}&pageSize=${pageSize}`,
  // );
  const data = {
    items: [
      {
        id: 1,
        name: "Item 1dwdwd wwwdwwddwd wlkj djwa djwdj wkjwak kwa",
        location: "Location 1",
      },
      { id: 2, name: "Item 2", location: "Location 2" },
    ],
  };
  return data.items;
};

function Sidebar() {
  const [sidebar, setSidebar] = useState(true);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <div onClick={showSidebar} className="absolute z-50 top-6 left-6">
        <Image src={sidebar ? hamClose : hamOpen} alt="hamburger" />
      </div>
      <div className={sidebar ? "newChat active" : "newChat"}>
        <FaPlus size={20} color="#7b7b7b" />
        <div className={sidebar ? "" : "hidden"}>New Chat</div>
      </div>
      <nav className={sidebar ? "sidebar active" : "sidebar"}>
        <div className="flex flex-col justify-center items-center">
          <div
            className={
              sidebar
                ? "opacity-100 transition-all duration-150"
                : "opacity-0 transition-all duration-150"
            }
          >
            <Pagination pageSize={5} />
          </div>
          <div></div>
        </div>
      </nav>
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
        <ul className=" max-h-[550px] overflow-auto">
          {items.map((item) => (
            <li
              className="flex relative items-center max-w-48 mb-2 text-[#455a64] py-2 px-6 gap-4 chat-bg rounded-[40px]"
              key={item.id}
            >
              <CiChat1 size={20} color="#7b7b7b" />
              <div className="mb-1 w-full overflow-ellipsis whitespace-nowrap overflow-hidden break-keep">
                {item.name}
              </div>
              <div className="absolute top-6 right-3 text-[11px]">
                {item.location}
              </div>
            </li>
            // Render other properties as needed
          ))}
        </ul>
        {loading && <p>Loading...</p>}
        {!loading && (
          <button onClick={handleLoadMore} disabled={loading}>
            Load More
          </button>
        )}
      </div>
    )
  );
};

export default Sidebar;
