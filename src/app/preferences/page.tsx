"use client";
import Navbar from "../../components/Navbar";
import maleIllustration from "../../assets/svgs/male_illustration.svg";
import Image from "next/image";
import PreferenceForm from "../../components/PreferenceForm";

const page = () => {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen">
      <Navbar />
      <PreferenceForm />
      <Image className="w-full" src={maleIllustration} alt="illustration" />
    </main>
  );
};

export default page;
