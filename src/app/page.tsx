"use client";
import Image from "next/image";
import Link from "next/link";
import illustration from "../assets/svgs/illustration.svg";
import illustrationMobile from "../assets/svgs/illustrationMobile.svg";
import akaikaLogo from "../assets/svgs/akaikeLogo.svg";
import iisc from "../assets/images/iicsLogo.webp";
import Navbar from "../components/Navbar";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "../services";
import { toast } from "react-toastify";
import { useGlobalContext } from "../hooks/context";

export default function Home() {
  const { user } = useUser();
  const { setNewUser } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      (async () => {
        const res = await createUser();
        if (res.error) {
          toast.error(res.error);
          return;
        }
        if (res.data.message === "New user created.") {
          setNewUser(true);
        }
      })();
      router.push("/preferences"); // Redirect if user exists
    }
  }, [user]);

  return (
    <>
      <main className="flex flex-col items-center justify-between min-h-screen md:hidden">
        <Navbar isStart />
        <div className="my-10">
          <Headings />
        </div>
        <GetStarted />
        <div className="flex flex-col items-center gap-2">
          <Image
            className="w-[80%]"
            src={illustrationMobile}
            alt="illustration"
          />
          <PoweredBy />
        </div>
      </main>
      <main className="flex-row items-center justify-between hidden min-h-screen md:flex">
        <div className="flex flex-col items-center justify-between w-1/2 h-screen home-bg">
          <div className="absolute text-6xl font-bold text-red-saathi top-10 left-10">
            SAATHI
          </div>
          <div></div>
          <Headings />
          <Image src={illustration} alt="illustration" />
        </div>
        <div className="flex flex-col items-center justify-between w-1/2">
          <GetStarted />
          <div className="absolute bottom-5">
            <PoweredBy />
          </div>
        </div>
      </main>
    </>
  );
}

const Headings = () => {
  return (
    <div className="max-w-72 md:max-w-[490px] md:mt-56 text-center">
      <div className="text-3xl md:text-[40px] font-medium text-red-saathi">
        Welcome to SAATHI
      </div>
      <div className="text-[18px] md:text-[28px] font-medium text-center mt-2">
        Voice and text based friendly multilingual financial scheme advisor.
      </div>
    </div>
  );
};

const GetStarted = () => {
  return (
    <div className="text-center">
      <div className="text-[24px] md:text-[40px] mb-3 font-medium">
        Get Started
      </div>
      <Link
        href="/api/auth/login"
        className="shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-3xl md:rounded-[60px] bg-[#ff725e] text-white text-[20px] md:text-[32px] font-medium  px-6 py-3 md:py-4 md:px-8 active:scale-95 transition-all duration-100"
      >
        Log in
      </Link>
    </div>
  );
};

const PoweredBy = () => {
  return (
    <div className="my-4 text-sm text-center md:text-lg text-gray-saathi-2">
      <div>Powered By</div>
      <div className="flex items-center gap-12">
        <Image
          className="w-auto h-6 md:h-12"
          src={akaikaLogo}
          alt="akaika logo"
        />
        <Image className="w-10 h-auto md:w-20" src={iisc} alt="iisc logo" />
      </div>
    </div>
  );
};
