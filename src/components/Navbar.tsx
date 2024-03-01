"use client";

import Link from "next/link";

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
  return (
    <nav className="flex flex-col w-full text-[24px] font-bold px-[25px] pt-4 md:pt-[25px] text-red-saathi">
      <div className={`${!isStart ? "text-center" : ""} md:text-8xl my-4`}>
        SAATHI
      </div>
      {!isStart && (
        <div className="flex text-black justify-center font-medium w-full text-[12px] md:text-[28px]">
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
