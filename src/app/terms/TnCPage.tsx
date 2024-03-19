"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

import { useGlobalContext } from "../../hooks/context";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import checkSvg from "../../assets/svgs/check.svg";
import crossSvg from "../../assets/svgs/cross.svg";
import speakerSvg from "../../assets/svgs/speaker_tnc.svg";
import stopSvg from "../../assets/svgs/stop_tnc.svg";
import { checkUserTnCStatus, updateUserTnC } from "../../services";
import { toast } from "react-toastify";
import { generateSessionId } from "../../utils/utils";
import { textToSpeech } from "../chat/util";
import { SpeakerAudioDestination } from "microsoft-cognitiveservices-speech-sdk";
import { useChatContext } from "../chat/context/ChatContext";

const TERMS_AND_CONDITIONS = {
  hindi: [
    "SAATHI को भारतीय विज्ञान संस्थान, ऑक्सफोर्ड ब्रूक्स यूनिवर्सिटी, अकाइके टेक्नोलॉजीज़ और कोटक महिंद्रा बैंक के विशेषज्ञों द्वारा विकसित किया गया है। यह परियोजना बिल एंड मेलिंडा गेट्स फाउंडेशन द्वारा वित्त पोषित है।",
    "● SAATHI आपको आपके प्रश्नों के उत्तर प्रदान करता है।",
    "● SAATHI सत्यापन उद्देश्यों के लिए बातचीत को संग्रहित करता है।",
    "● SAATHI आपके लॉगिन को सुविधाजनक बनाने के लिए आपका फ़ोन नंबर संग्रहित करता है। हालांकि, इसका उपयोग अन्य उद्देश्यों के लिए नहीं किया जाएगा।",
    "● SAATHI का लक्ष्य एक सहायक उपकरण बनना है और उत्तर में कोई भी पूर्वाग्रह अनजाने में है।",
    "SAATHI से प्रश्न पूछकर, आप उपरोक्त नियमों और शर्तों से सहमत होते हैं।",
  ],
  english: [
    "SAATHI is developed by experts from the Indian Institute of Science, Oxford Brookes University, Akaike Technologies, and Kotak Mahindra Bank. This project is funded by the Bill and Melinda Gates Foundation.",
    "● SAATHI provides you with answers to your queries.",
    "● SAATHI stores conversation for validation purposes.",
    "● SAATHI stores your phone number to facilitate your login. However, it will not be used for other purposes.",
    "● SAATHI aims to be a helpful tool and any bias in the answer is unintentional.",
    "By asking a query to SAATHI, you agree to the above terms and conditions. ",
  ],
  kannada: [
    "SAATHI ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು (SAATHI Terms and Conditions)",
    "● SAATHI ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ.",
    "● SAATHI ಮೌಲ್ಯೀಕರಣ ಉದ್ದೇಶಗಳಿಗಾಗಿ ಸಂಭಾಷಣೆಗಳನ್ನು ಸಂಗ್ರಹಿಸುತ್ತದೆ.",
    "● ನಿಮ್ಮ ಲಾಗಿನ್ ಅನ್ನು ಸುಲಭಗೊಳಿಸಲು SAATHI ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ಸಂಗ್ರಹಿಸುತ್ತದೆ. ಆದಾಗ್ಯೂ, ಇದನ್ನು ಇತರ ಉದ್ದೇಶಗಳಿಗಾಗಿ ಬಳಸಲಾಗುವುದಿಲ್ಲ.",
    "● SAATHI ಒಂದು ಸಹಾಯಕ ಸಾಧನವಾಗಲು ಗುರಿ ಹೊಂದಿದೆ ಮತ್ತು ಉತ್ತರದಲ್ಲಿ ಯಾವುದೇ ಪಕ್ಷಪಾತವು ಉದ್ದೇಶಪೂರ್ವಕವಲ್ಲ.",
    "SAATHI ಗೆ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳುವ ಮೂಲಕ, ನೀವು ಮೇಲಿನ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳಿಗೆ ಸಮ್ಮತಿಸುತ್ತೀರಿ.",
  ],
  tamil: [
    "SAATHI ஆனது இந்திய அறிவியல் கழகம், ஆக்ஸ்போர்டு புரூக்ஸ் பல்கலைக்கழகம், அகைகே டெக்னாலஜிஸ் மற்றும் கோடக் மஹிந்திரா வங்கி ஆகியவற்றின் நிபுணர்களால் உருவாக்கப்பட்டது. இந்த திட்டத்திற்கு பில் மற்றும் மெலிண்டா கேட்ஸ் அறக்கட்டளை நிதியளிக்கிறது.",
    "● உங்கள் கேள்விகளுக்கான பதில்களை SAATHI உங்களுக்கு வழங்குகிறது.",
    "● சரிபார்ப்பு நோக்கங்களுக்காக SAATHI உரையாடலைச் சேமிக்கிறது.",
    "● உங்கள் உள்நுழைவை எளிதாக்க, SAATHI உங்கள் தொலைபேசி எண்ணைச் சேமிக்கிறது. இருப்பினும், இது மற்ற நோக்கங்களுக்காக பயன்படுத்தப்படாது.",
    "● SAATHI ஒரு பயனுள்ள கருவியாக இருப்பதை நோக்கமாகக் கொண்டுள்ளது மற்றும் ஒருசார்பு அற்ற பதில்களை அளிக்கக்கூடியது.",
    "SAATHI யிடம் வினவல் கேட்பதன் மூலம், மேலே உள்ள விதிமுறைகள் மற்றும் நிபந்தனைகளை ஏற்கிறீர்கள்.",
  ],
};

const Terms = () => {
  const router = useRouter();
  const { language, voice, setSessionId } = useGlobalContext();
  const [optionLang, setOptionLang] = useState({ accept: "", decline: "" });
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const { ttsController, setTtsController, setIsAudioPlaying } = useChatContext();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const {
          data: { terms_and_conditions_status },
        } = await checkUserTnCStatus();
        setIsAccepted(terms_and_conditions_status);
      } catch (error) {
        console.error("Error checking TnC status:", error);
        toast.error("Something went wrong. Please try again later");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const accept = {
      kannada: "ಸುಲಭ",
      hindi: "स्वीकार",
      english: "ACCEPT",
      tamil: "ACCEPT",
    };

    const decline = {
      kannada: "ಅಸುಲಭ",
      hindi: "अस्वीकार",
      english: "DECLINE",
      tamil: "DECLINE",
    };

    setOptionLang({
      accept: accept[language.toLowerCase() as keyof typeof accept],
      decline: decline[language.toLowerCase() as keyof typeof decline],
    });
  }, [language]);

  const handleAccept = async () => {

    handleStopReplay(); // stop tts

    if (isAccepted) {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      router.replace("/chat");
      return;
    }

    setLoading(true);
    const res = await updateUserTnC({ status_input: 1 });

    if (res.error) {
      toast.error(res.error);
    } else if (res.data.message === "Terms and conditions status updated") {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      router.replace("/chat");
    }
  };
  const handleDecline = async () => {

    handleStopReplay(); // stop tts

    setLoading(true);
    const res = await updateUserTnC({ status_input: 0 });
    if (res.error) {
      return toast.error(res.error);
    }
    window.location.href = "/api/auth/logout";
  };

  const handleStopReplay = () => {
    ttsController?.pause();
    setIsPlaying(false);

    ttsController?.close(() => {
      setIsAudioPlaying(false);
    });
  };

  const termsAndConditions = () => {
    switch (language.toLowerCase()) {
      case "hindi":
        return TERMS_AND_CONDITIONS["hindi"];
      case "kannada":
        return TERMS_AND_CONDITIONS["kannada"];
      case "tamil":
        return TERMS_AND_CONDITIONS["tamil"];
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
                const controller = textToSpeech(
                  getTnCText(termsAndConditions()),
                  language,
                  voice,
                  () => setIsPlaying(true),
                  () => setIsPlaying(false),
                );
                setTtsController(controller.player);
              }}
              src={speakerSvg}
              alt="avatar"
              className={`ml-2 w-8 h-8 ${
                loading ? "opacity-50 pointer-events-none" : ""
              } `}
            />
          ) : (
            <Image
              onClick={handleStopReplay}
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
          className={`${
            loading ? "opacity-50 pointer-events-none" : "" // Disable button when loading
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
          className={`${
            loading ? "opacity-50 pointer-events-none" : "" // Disable button when loading
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
