"use client";
import Image from "next/image";
import Link from "next/link";
import illustration from "../assets/svgs/illustration.svg";
import akaikaLogo from "../assets/images/akaikeLogo.png";
import iisc from "../assets/images/iicsLogo.webp";
import Navbar from "../components/Navbar";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
 const { user } = useUser();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Navbar isStart />
      <div className="my-10">
        <Headings />
      </div>
      <GetStarted />
      <div className="flex flex-col items-center gap-2">
        <Image className="w-[80%]" src={illustration} alt="illustration" />
        <PoweredBy />
      </div>
    </main>
  );
}

const Headings = () => {
  return (
    <div className="max-w-72 md:max-w-[490px] text-center">
      <div className="text-2xl md:text-[40px] font-medium text-red-saathi">
        Welcome to SAATHI
      </div>
      <div className="text-[16px] md:text-[32px] text-center mt-2">
        Learn all about the government schemes today
      </div>
    </div>
  );
};

const GetStarted = () => {
  return (
    <div className="text-center">
      <div className="text-[20px] md:text-[40px] mb-3">Get Started</div>
      <Link
        href="/api/auth"
        className="shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-3xl md:rounded-[60px] bg-[#ff725e] text-white text-[16px] md:text-[32px] font-medium  px-5 py-2 md:py-4 md:px-8"
      >
        Log in
      </Link>
    </div>
  );
};

const PoweredBy = () => {
  return (
    <div className="text-center my-4 text-sm md:text-lg text-gray-saathi-2">
      <div>Powered By</div>
      <div className="flex items-center gap-12">
        <Image
          className="w-auto h-6 md:h-12"
          src={akaikaLogo}
          alt="akaika logo"
        />
        <Image className="w-10 md:w-20 h-auto" src={iisc} alt="iisc logo" />
      </div>
    </div>
  );
};
