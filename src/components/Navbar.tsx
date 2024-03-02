"use client";

import Link from "next/link";
import Image from "next/image";
import userImage from "../assets/svgs/user_profile.svg";
import { useEffect, useRef, useState } from "react";
import logout from "../assets/svgs/logout.svg";
import { useGlobalContext } from "../hooks/context";
import { useUser } from "@auth0/nextjs-auth0/client";

type Props = {
  isStart?: boolean;
};

type Tab = {
  name: string;
  link: string;
};

const tabs: Tab[] = [
  {
    name: "Scheme",
    link: "/",
  },
  {
    name: "Access",
    link: "/",
  },
  {
    name: "Attention",
    link: "/",
  },
  {
    name: "Training",
    link: "/",
  },
  {
    name: "Help",
    link: "/",
  },
  {
    name: "Inclusion",
    link: "/",
  },
];

const Navbar = ({ isStart }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<any>(null);
  const optionsRef = useRef<any>(null);
  const { user } = useUser();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      optionsRef.current &&
      !optionsRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <nav className="relative flex flex-col w-full text-[36px] font-bold px-[25px] pt-4 md:pt-[25px] text-red-saathi">
      <div className={`${!isStart ? "text-center" : ""} md:text-8xl my-4`}>
        SAATHI
      </div>
      {user && (
        <div className="absolute right-4 md:right-16 md:top-10">
          <Image
            ref={dropdownRef}
            className="h-10 w-10 md:h-14 md:w-14"
            onClick={() => setIsOpen(!isOpen)}
            src={userImage}
            alt="user"
          />
          {isOpen && (
            <div
              ref={optionsRef}
              onClick={() => (window.location.href = "/api/auth/logout")}
              className={`flex justify-center items-center gap-1 md:gap-3 absolute right-0 px-8 md:px-12 py-2 cursor-pointer bg-gray-saathi-1 rounded-2xl md:rounded-3xl text-gray-saathi-2 text-sm md:text-xl`}
            >
              <Image className="w-auto h-8 md:h-12" src={logout} alt="logout" />
              <div>Logout</div>
            </div>
          )}
        </div>
      )}
      {!isStart && (
        <div className="flex text-black justify-center font-medium w-full text-[14px] md:text-[28px]">
          {tabs.map((tab, index) => (
            <div key={index}>
              <Link href={tab.link}>{tab.name}</Link>
              {tabs.length - 1 > index && <span className="mx-1">|</span>}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
