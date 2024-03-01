"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

import { useGlobalContext } from "../../hooks/context";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import checkSvg from "../../assets/svgs/check.svg";
import crossSvg from "../../assets/svgs/cross.svg";
import speakerSvg from "../../assets/svgs/speaker_tnc.svg";
import stopSvg from "../../assets/svgs/stop_tnc.svg";
import { acceptUserTnC, checkUserTnCStatus } from "../../services";
import { toast } from "react-toastify";
import { generateSessionId } from "../../utils/utils";
import { useChatContext } from "../chat/context/ChatContext";
import { textToSpeech } from "../chat/util";
import { SpeakerAudioDestination } from "microsoft-cognitiveservices-speech-sdk";

const TERMS_AND_CONDITIONS = {
  hindi: [
    "● SAATHI का उद्देश्य आपके प्रश्नों के लिए आपको उत्तर प्रदानकरना है",
    "● SAATHI आपके प्रश्नों और उसके द्वारा प्रदान किए गए उत्तरों को संग्रहित करता है ताकि हम यह सत्यापित कर सकें कि उत्तर आपके प्रश्न के लिए उपयुक्त और संबंधित थे।",
    "● SAATHI आपकी व्यक्तिगत जानकारी का संग्रहित नहीं करता है।",
    "● SAATHI एक बहुत ही सहायक उपकरण बनने का उद्देश्य रखता है और उत्तर में किसी भी प्रकार की पक्षपात की अनजाने में कोई भी चाह कर नहीं किया जाता है।",
    "SAATHI से प्रश्न पूछकर आप उपरोक्त नियमों और शर्तों से सहमत हो रहे हैं।",
    "यह परियोजना बिल एंड मेलिंडा गेट्स फाउंडेशन द्वारा वित्त पोषित है",
  ],
  english: [
    "SAATHI User Consent Terms and Conditions",
    "SAATHI is developed by a consortium of researchers (Indian Institute of Science, Bangalore, and Oxford Brookes University, UK), technical experts from Akaike Technologies and the banking professionals from Kotak Mahindra Bank.",
    "● SAATHI aims to provide you with answers for your queries.",
    "● SAATHI stores your questions and the answers that it provides so that we can validate and verify if the answers were appropriate and relevant to your question.",
    "● SAATHI does not ask or store your personal information.",
    "● SAATHI aims to be a very helpful tool and any bias in the answer is unintentional.",
    "By asking a query to SAATHI you are agreeing to the above terms and conditions.",
    "This project is funded by the Bill & Melinda Gates Foundation",
  ],
};

const Terms = () => {
  const router = useRouter();
  const { language, voice, setSessionId } = useGlobalContext();
  const { isAudioPlaying, setIsAudioPlaying } = useChatContext();
  const [optionLang, setOptionLang] = useState({ accept: "", decline: "" });
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ttsController, setTtsController] = useState<SpeakerAudioDestination>();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await checkUserTnCStatus();
      if (res.data.terms_and_conditions_status) {
        const newSessionId = generateSessionId();
        setSessionId(newSessionId);
        router.replace("/chat");
      } else {
        setLoading(false);
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
    } else if (res.data.message === "Terms and conditions accepted") {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      router.replace("/chat");
    }
  };
  const handleDecline = () => {
    router.replace("/");
  };

  const termsAndConditions = () => {
    switch (language.toLowerCase()) {
      case "hindi":
        return TERMS_AND_CONDITIONS["hindi"];
      case "english":
        return TERMS_AND_CONDITIONS["english"];
      default:
        return TERMS_AND_CONDITIONS["english"];
    }
  };

  const getTnCText = (strList: string[]) => {
    strList = strList.map((str) => str.replace("●", ""));
    return strList.join(", ");
  };

  return (
    <main className="flex flex-col items-center mt-2">
      <Navbar />
      <section className=" bg-[#F1F1F1] mt-2 rounded-[40px] p-8   w-[95%]">
        <div className="flex items-center md:gap-2">
          <h2 className="text-[#302B27] text-2xl md:text-[48px] not-italic font-bold leading-[normal]">
            {language.toLowerCase() === "hindi"
              ? "नियम और शर्तें"
              : "Terms & Conditions"}
          </h2>
          {!isPlaying ? (
            <Image
              onClick={() => {
                const { player } = textToSpeech(
                  getTnCText(termsAndConditions()),
                  language,
                  voice,
                  () => setIsPlaying(true),
                  () => setIsAudioPlaying(false),
                );

                setTtsController(player);
              }}
              src={speakerSvg}
              alt="avatar"
              className="ml-2 w-8 h-8"
            />
          ) : (
            <Image
              onClick={() => {
                ttsController?.pause();
              }}
              src={stopSvg}
              alt="avatar"
              className="ml-2 w-8 h-8"
            />
          )}
        </div>
        <div className="mt-2 max-h-[500px] overflow-y-scroll text-[#6D6D6D] md:text-xl not-italic font-normal leading-[normal]">
          <ul>
            {termsAndConditions().map((term, index) => {
              return (
                <li className="my-2" key={index}>
                  {term}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <footer className="mt-8 flex justify-evenly items-center w-full">
        <div
          onClick={handleAccept}
          className={`${loading ? "opacity-50 pointer-events-none" : "" // Disable button when loading
            } shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[60px] bg-[#ff725e] text-white text-xl md:text-[50px] not-italic font-bold leading-[normal] flex justify-center gap-4 items-center w-[40%] py-4 px-2`}
        >
          <div>{optionLang.accept}</div>
          <Image
            src={checkSvg}
            alt="avatar"
            className="w-5 h-5 md:w-10 md:h-10"
          />
        </div>
        <div
          onClick={handleDecline}
          className={`${loading ? "opacity-50 pointer-events-none" : "" // Disable button when loading
            } border shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[60px] border-solid border-[#D6D6D6] cursor-pointer text-[#302B27] text-xl md:text-[50px] not-italic font-bold leading-[normal] px-3 py-4 flex justify-center items-center w-[40%] gap-4`}
        >
          <div>{optionLang.decline}</div>
          <Image
            src={crossSvg}
            alt="avatar"
            className="w-5 h-5 md:w-10 md:h-10"
          />
        </div>
      </footer>
    </main>
  );
};

export default withPageAuthRequired(Terms);
