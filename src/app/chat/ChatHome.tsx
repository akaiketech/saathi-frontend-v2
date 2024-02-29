"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { TranslationRecognizer } from "microsoft-cognitiveservices-speech-sdk";
import Lottie from "react-lottie";
import chatMicrophone from "../../assets/svgs/chatMicrophone.svg";
import chatBot from "../../assets/svgs/chatBot.png";
import avatar from "../../assets/svgs/avatar.svg";
import replaySvg from "../../assets/svgs/replay.svg";
import submitBtn from "../../assets/svgs/submitBtn.svg";

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import {
  feedBackApi,
  textToSpeech,
  translateFromInput,
  translationOnceFromMic,
} from "./util";
import Image from "next/image";
import { useGlobalContext } from "../../hooks/context";

import animationData from "./mike-animation.json";
import loadingData from "./loading.json";
import Sidebar from "../../components/Sidebar";
import { useChatContext } from "./context/ChatContext";
import { Message } from "../../types";

const ChatPage = () => {
  const router = useRouter();
  const { language, location, sessionId, voice, sideBarOpen } =
    useGlobalContext();
  const {
    messages,
    setMessages,
    isRecording,
    isAudioPlaying,
    isLoading,
    setIsRecording,
    setCurrentPlayingIndex,
    setIsAudioPlaying,
    setTtsController,
    setIsLoading,
  } = useChatContext();
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [starRating, setStarRating] = useState(0);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [recognizer, setRecognizer] = useState<TranslationRecognizer>();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptionsForLoading = {
    loop: true,
    autoplay: true,
    animationData: loadingData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleRatingClick = (rating: number) => {
    setStarRating(rating);
  };

  const showQuestion = (messageObj: Message) => {
    let question = "";
    const lowerCaseLang = language.toLowerCase();

    switch (lowerCaseLang) {
      case "hindi":
        question = messageObj.question.hindiText;
        break;

      case "tamil":
        question = messageObj.question.tamilText;
        break;

      case "kannada":
        question = messageObj.question.kannadaText;

        break;

      default:
        question = messageObj.question.englishText;
    }
    return question;
  };

  const handleSubmit = async () => {
    const inputRef = document.getElementById("question") as HTMLInputElement;
    // get input value
    const inputValue = inputRef.value;

    translateFromInput({
      text: inputValue,
      language,
      location,
      sessionId,
      setIsAudioPlaying,
      setMessages,
      setIsLoading,
    });
    inputRef.value = "";
  };

  return (
    <main className="flex flex-col justify-end pt-6 pl-6 pr-6">
      <Sidebar />
      <header className="flex">
        <h2
          className={`text-red-saathi text-[24px] mt-2 md:mt-0 md:text-[48px] not-italic ml-20 z-50 font-bold leading-[normal] transition-all duration-500 ease-in-out ${
            sideBarOpen && "md:ml-[240px]"
          }`}
        >
          SAATHI
        </h2>
        {isFeedbackDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-8 bg-white rounded-lg w-96">
              <h3 className="mb-4 text-xl text-center">
                We'd love your feedback!
              </h3>
              <div className="flex justify-center my-6">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    className={`p-2 text-4xl  ${
                      starRating >= rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                    onClick={() => handleRatingClick(rating)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <div className="flex justify-evenly">
                <button
                  className="p-2 mr-2 text-white bg-red-500 rounded"
                  onClick={() => {
                    setStarRating(0);
                    setIsFeedbackDialogOpen(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="p-2 text-white bg-blue-500 rounded"
                  onClick={async () => {
                    if (starRating === 0) {
                      toast.info(
                        "please provide us with rating. so, that we will be able to help you better.",
                        {
                          autoClose: 5000,
                          position: "top-right",
                        },
                      );
                      return;
                    }
                    const data = await feedBackApi(sessionId, starRating);
                    if (data) {
                      setIsFeedbackDialogOpen(false);
                      router.replace("/");
                    }
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
      <div
        // className={`h-[calc(100vh-300px)] md:h-[calc(100vh-350px)] md:ml-20 mt-20 md:mt-10 overflow-auto transition-all duration-500 ${
        //   sideBarOpen && "ml-[240px] w-[calc(100%-240px)]"
        // }`}
        className={`h-[calc(100vh-280px)] md:h-[calc(100vh-350px)] ml-0 mt-10 overflow-auto transition-all duration-500 ${
          sideBarOpen ? "md:ml-[240px]" : "md:ml-20"
        }`}
        ref={messagesEndRef}
      >
        {messages.length ? (
          messages.map((messageObj, index) => (
            <div key={index} className="flex flex-col w-full py-4 md:p-8">
              <div className="flex items-end ml-auto w-fit max-w-[50%]">
                <div className="p-3 rounded-[30px_30px_0px_30px] bg-[#ff725e]">
                  <div className="text-white text-sm md:text-2xl not-italic font-medium leading-[normal] text-right">
                    {showQuestion(messageObj)}
                  </div>
                </div>
                <div className="hidden ml-1 md:block">
                  <Image src={avatar} alt="avatar" height={36} width={36} />
                </div>
              </div>
              {messageObj.isLoading ? (
                <div>
                  <Lottie
                    options={defaultOptionsForLoading}
                    height={200}
                    width={200}
                  />
                </div>
              ) : (
                messageObj.answer && (
                  <>
                    <div className="flex items-end">
                      <div className="hidden mr-1 md:block">
                        <Image
                          src={chatBot}
                          alt="chatBot"
                          height={36}
                          width={36}
                        />
                      </div>
                      <div className="w-1/2 p-3 rounded-[30px_30px_30px_0px] bg-[#FFCBC366] text-gray-700">
                        <div className="text-sm md:text-2xl not-italic font-medium leading-[normal]">
                          {messageObj.answer}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end w-1/2 mt-1 md:ml-8">
                      <button
                        className="flex items-center text-sm md:text-lg"
                        onClick={() => {
                          const currentMesssage = messages[index];
                          isAudioPlaying ||
                            textToSpeech(
                              currentMesssage.answer,
                              language,
                              voice,
                              () => setIsAudioPlaying(true),
                              () => setIsAudioPlaying(false),
                            );
                        }}
                      >
                        <Image
                          src={replaySvg}
                          alt="avatar"
                          className="mr-1 w-4 h-4"
                        />
                        Replay
                      </button>
                    </div>
                  </>
                )
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col md:ml-10 h-full text-2xl text-black bg-red">
            <h1 className="chat-heading text-[24px] md:text-[46px]">
              Hello, Welcome back!
            </h1>
            <h3 className="text-[#b3b3b3] mt-4 font-medium text-xl md:text-4xl">
              How can I help you today?
            </h3>
          </div>
        )}
      </div>

      <footer>
        <div
          className={`flex flex-col items-center z-10 justify-center transition-all duration-500 ease-in-out ${
            sideBarOpen && "md:ml-[240px]"
          }`}
        >
          {isRecording ? (
            <div className="z-10">
              <Lottie options={defaultOptions} height={150} width={150} />
            </div>
          ) : (
            <div
              className={`flex flex-col z-10 items-center gap-4 ${
                isAudioPlaying ? "opacity-50" : ""
              }`}
              onClick={() => {
                if (isAudioPlaying || isLoading) return;
                setIsRecording(true);
                const rec = translationOnceFromMic({
                  language,
                  location,
                  sessionId,
                  voice,
                  isAudioPlaying,
                  messages,
                  setIsAudioPlaying,
                  setIsRecording,
                  setMessages,
                  setCurrentPlayingIndex,
                  setIsLoading,
                  setTtsController,
                });
                setRecognizer(rec);
              }}
            >
              <div className="flex items-center cursor-pointer z-10 p-4 bg-[#f1f1f1] rounded-full">
                <Image
                  className="h-16 w-16 md:h-24 md:w-24"
                  src={chatMicrophone}
                  alt="chatMicrophone.svg"
                />
              </div>
            </div>
          )}
          <div className="relative flex justify-center items-center gap-2 w-full max-w-[740px] pl-4 md:pl-12 pr-2 md:pr-6 pt-6 md:pt-9 pb-4 -mt-9 bg-[#f1f1f1] rounded-[20px]">
            <input
              id="question"
              type="text"
              placeholder="Ask any question here"
              className="rounded-[20px] z-10 h-[40px] md:h-[60px] w-full text-sm md:text-2xl bg-[#e9e9e9] py-2 px-3"
            />
            <div
              onClick={() => {
                if (isLoading) return;
                handleSubmit();
              }}
            >
              <Image src={submitBtn} alt="submitBtn" height={30} width={30} />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default withPageAuthRequired(ChatPage);
