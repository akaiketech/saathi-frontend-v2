"use client";
import Navbar from "../../components/Navbar";
import maleIllustration from "../../assets/svgs/male_illustration.svg";
import Image from "next/image";
import Link from "next/link";
import PreferenceForm from "../../components/PreferenceForm";

const page = () => {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen">
      <Navbar />
      <PreferenceForm />
      <Link href="/terms" className="text-sm text-red-saathi underline cursor-pointer md:mt-4">Terms and Conditions</Link>
      <Image className="w-full" src={maleIllustration} alt="illustration" />
    </main>
  );
};

export default page;
