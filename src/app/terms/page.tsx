"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

import { useGlobalContext } from "../../hooks/context";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import checkSvg from "../../assets/svgs/check.svg";
import crossSvg from "../../assets/svgs/cross.svg";
import { acceptUserTnC, checkUserTnCStatus } from "../../services";
import { toast } from "react-toastify";

const tabs = ["Scheme", "Access", "Attention", "Training", "Help", "Inclusion"];

const Terms = () => {
  const router = useRouter();
  const { language, setSessionId } = useGlobalContext();
  const [optionLang, setOptionLang] = useState({ accept: "", decline: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await checkUserTnCStatus();
      if (res.data.status) {
        router.replace("/chat");
      }
    })();
  }, []);

  useEffect(() => {
    setOptionLang({
      accept: language.toLowerCase() === "hindi" ? "स्वीकार" : "ACCEPT",
      decline: language.toLowerCase() === "hindi" ? "अस्वीकार" : "DECLINE",
    });
  }, [language]);


  const handleAccept = async () => {
    setLoading(true);
    const res = await acceptUserTnC();

    if (res.error) {
      toast.error(res.error);
    } else if (res.data.updated) {
      router.replace("/chat");
    }

    console.log(res);
  };
  const handleDecline = () => {
    router.replace("/");
  };

  return (
    <main className="flex flex-col items-center mt-2">
      <Navbar />
      <section className=" bg-[#F1F1F1] mt-2 rounded-[40px] p-8   w-[95%]">
        <h2 className="text-[#302B27] text-[48px] not-italic font-bold leading-[normal]">
          {language.toLowerCase() === "hindi"
            ? "नियम और शर्तें"
            : "Terms & Conditions"}
        </h2>
        <div className="mt-2 h-[600px] overflow-y-scroll text-[#6D6D6D] text-xl not-italic font-normal leading-[normal]">
          {language.toLowerCase() === "hindi" ? (
            <div>
              <div>
                <div className="my-4">नियम और शर्तें</div>
                <ul>
                  <li className="my-2">
                    ● SAATHI का उद्देश्य आपके प्रश्नों के लिए आपको उत्तर प्रदान
                    करना है।
                  </li>
                  <li className="my-2">
                    ● SAATHI आपके प्रश्नों और उसके द्वारा प्रदान किए गए उत्तरों
                    को संग्रहित करता है ताकि हम यह सत्यापित कर सकें कि उत्तर
                    आपके प्रश्न के लिए उपयुक्त और संबंधित थे।
                  </li>
                  <li className="my-2">
                    ● SAATHI आपकी व्यक्तिगत जानकारी का संग्रहित नहीं करता है।
                  </li>
                  <li className="my-2">
                    ● SAATHI एक बहुत ही सहायक उपकरण बनने का उद्देश्य रखता है और
                    उत्तर में किसी भी प्रकार की पक्षपात की अनजाने में कोई भी चाह
                    कर नहीं किया जाता है।
                  </li>
                </ul>
                <div>
                  SAATHI से प्रश्न पूछकर आप उपरोक्त नियमों और शर्तों से सहमत हो
                  रहे हैं।
                </div>
                <div className="my-2">
                  यह परियोजना बिल एंड मेलिंडा गेट्स फाउंडेशन द्वारा वित्त पोषित
                  है
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="font-semibold">
                SAATHI User Consent Terms and Conditions
              </div>
              <div>
                <div className="my-4">
                  SAATHI is developed by a consortium of researchers (Indian
                  Institute of Science, Bangalore, and Oxford Brookes
                  University, UK), technical experts from Akaike Technologies
                  and the banking professionals from Kotak Mahindra Bank.
                </div>
                <ul>
                  <li className="my-2">
                    ● SAATHI aims to provide you with answers for your queries.
                  </li>
                  <li className="my-2">
                    ● SAATHI stores your questions and the answers that it
                    provides so that we can validate and verify if the answers
                    were appropriate and relevant to your question.
                  </li>
                  <li className="my-2">
                    ● SAATHI does not ask or store your personal information.
                  </li>
                  <li className="my-2">
                    ● SAATHI aims to be a very helpful tool and any bias in the
                    answer is unintentional.
                  </li>
                </ul>
                <div>
                  By asking a query to SAATHI you are agreeing to the above
                  terms and conditions.
                </div>
                <div className="my-2">
                  This project is funded by the Bill & Melinda Gates Foundation
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <footer className="mt-8 flex justify-evenly items-center w-full">
        <div
          onClick={handleAccept}
          className={`${
            loading ? "opacity-50 pointer-events-none" : "" // Disable button when loading
          } shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[60px] bg-[#ff725e] text-white text-[50px] not-italic font-bold leading-[normal]  flex justify-between items-center w-[40%] py-4`}
        >
          <div className="flex justify-between ">
            <div className="ml-8">{optionLang.accept}</div>
            {!loading && (
              <Image
                src={checkSvg}
                alt="avatar"
                height={40}
                width={40}
                className="ml-8"
              />
            )}
          </div>
          {!loading && (
            <span className="pl-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="46"
                viewBox="0 0 46 46"
                fill="none"
              ></svg>
            </span>
          )}
        </div>
        <div
          onClick={handleDecline}
          className={`${
            loading ? "opacity-50 pointer-events-none" : "" // Disable button when loading
          } border shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[60px] border-solid border-[#D6D6D6] cursor-pointer text-[#302B27] text-[50px] not-italic font-bold leading-[normal] px-8 py-4 flex justify-between items-center`}
        >
          {optionLang.decline}
          <Image
            src={crossSvg}
            alt="avatar"
            height={32}
            width={32}
            className="ml-8"
          />
        </div>
      </footer>
    </main>
  );
};

export default withPageAuthRequired(Terms);
