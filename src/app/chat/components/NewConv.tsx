"use client";
import moment from "moment";
import { IoLanguage } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";

import { Conversation } from "../../../types";
import { useChatContext } from "../context/ChatContext";
import animationData from "../../../lottie/loading.json";
import Lottie from "react-lottie";
import { useGlobalContext } from "../../../hooks/context";

type Props = {
  isNewUser: boolean;
  conversations: Conversation[];
};

const NewConv = ({ isNewUser, conversations }: Props) => {
  const { isLoading, openConversation } = useChatContext();
  const { language } = useGlobalContext();

  const getGreetingMessage = () => {
    let namaste = "Namaste!";
    let greeting =
      "Welcome to Saathi, your friendly financial scheme advisor through voice and text. Feel free to ask any questions, and I'll provide you with clear answers!";

    switch (language.toLowerCase()) {
      case "hindi":
        namaste = "नमस्ते!";
        greeting =
          "साथी में आपका स्वागत है, मैं एक ध्वनि एवं लेखन आधारित वित्तीय योजना सलाहकार हूं। कृपया कोई भी सवाल पूछें, और मैं आपको स्पष्ट उत्तर दूंगा!";
        break;

      case "tamil":
        namaste = "வணக்கம்!";
        greeting =
          "SAATHI க்கு வரவேற்கிறோம். குரல் மற்றும் உரை மூலம் பொருத்தமான நிதி உதவித் திட்டத்தைப் பெற உங்கள் நட்பு ஆலோசகர். கேள்விகளுக்கு தெளிவான பதில்களைப் பெறலாம்!";
        break;

      case "kannada":
        namaste = "ಹಲೋ!";
        greeting =
          "ಧ್ವನಿ ಮತ್ತು ಪಠ್ಯದ ಮೂಲಕ ನಿಮ್ಮ ಸ್ನೇಹಪರ ಹಣಕಾಸು ಯೋಜನೆ ಸಲಹೆಗಾರ ಸಾಥಿಗೆ ಸುಸ್ವಾಗತ. ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಲು ಹಿಂಜರಿಯಬೇಡಿ ಮತ್ತು ನಾನು ನಿಮಗೆ ಸ್ಪಷ್ಟ ಉತ್ತರಗಳನ್ನು ನೀಡುತ್ತೇನೆ!";
        break;
    }

    return { namaste, greeting };
  };

  const defaultOptionsForLoading = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return !isLoading ? (
    <div className="flex flex-col md:ml-10 h-full text-2xl text-black bg-red">
      <h1 className="chat-heading text-[24px] md:text-[46px]">
        {getGreetingMessage().namaste}
      </h1>
      <h3 className="text-[#b3b3b3] mt-4 font-medium text-lg md:text-2xl">
        {getGreetingMessage().greeting}
      </h3>

      <div className="mt-6 md:mt-10">
        {conversations.length > 0 && (
          <p className="text-[#455a64] text-sm md:text-xl">
            Want to continue your last conversation?
          </p>
        )}
        <div className="flex flex-col md:flex-row gap-2">
          {conversations.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                openConversation(
                  item.conversation_id,
                  item.conversation_location,
                  item.conversation_language,
                );
              }}
              className="md:w-[48%] cursor-pointer mt-3 md:mt-6 bg-[#e9e9e9] rounded-2xl md:rounded-3xl px-2 md:px-4 pb-4"
            >
              <p className="text-[8px] md:text-[10px] text-end text-[#455a64]">
                {moment(item.created_at).format("DD MMMM YYYY")}
              </p>
              <h2 className="text-2xl overflow-x-hidden w-full text-[#ff725e] font-bold -mt-2 overflow-ellipsis whitespace-nowrap">
                {item.conversation_title}
              </h2>

              <div className="flex justify-between">
                <div className="flex gap-1 items-center text-[12px] md:text-sm text-[#455a64]">
                  <IoLanguage
                    size={18}
                    color="#ff725e"
                    className="w-4 md:w-6"
                  />
                  {item.conversation_language}
                </div>
                <div className="flex gap-1 items-center text-[12px] md:text-sm text-[#455a64]">
                  <IoLocationOutline
                    size={18}
                    color="#ff725e"
                    className="w-4"
                  />
                  {item.conversation_location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div>
      <Lottie options={defaultOptionsForLoading} height={200} width={200} />
    </div>
  );
};

export default NewConv;
