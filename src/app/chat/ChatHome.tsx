"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { TranslationRecognizer } from "microsoft-cognitiveservices-speech-sdk";
import Lottie from "react-lottie";
import chatMicrophone from "../../assets/svgs/chatMicrophone.svg";
import chatMicrophoneMobile from "../../assets/svgs/mobleMic.svg";
import chatBot from "../../assets/svgs/robot1.svg";
import profile from "../../assets/svgs/profile.svg";
import replaySvg from "../../assets/svgs/replay.svg";
import submitBtn from "../../assets/svgs/submitBtn.svg";
import stopSvg from "../../assets/svgs/stop_tnc.svg";
import thumbsUp from "../../assets/svgs/thumb_up.svg";
import thumbsDown from "../../assets/svgs/thumb_down.svg";
import thumbsUpOutline from "../../assets/svgs/thumb_up_outline.svg";
import thumbsDownOutline from "../../assets/svgs/thumb_down_outline.svg";
import { IoLanguage } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import Markdown from "react-markdown";

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import {
  feedBackApi,
  translateFromInput,
  translationOnceFromMic,
  voteApi,
} from "./util";
import Image from "next/image";
import { useGlobalContext } from "../../hooks/context";

import animationData from "./mike-animation.json";
import loadingData from "../../lottie/loading.json";
import chatAnimationData from "../../lottie/chatAnimation.json";
import Sidebar from "../../components/Sidebar";
import { useChatContext } from "./context/ChatContext";
import { Message } from "../../types";
import { generateSessionId } from "../../utils/utils";
import NewConv from "./components/NewConv";
import { FaPlus } from "react-icons/fa6";

const ChatPage = () => {
  const router = useRouter();
  const {
    voice,
    location,
    language,
    prefModal,
    sessionId,
    isNewUser,
    sideBarOpen,
    isChatLoading,
    setPrefModal,
    setSessionId,
    setSideBarOpen,
  } = useGlobalContext();
  const {
    conv,
    messages,
    isLoading,
    pageNumber,
    isRecording,
    isRecentConv,
    isAudioPlaying,
    fetchedAllChats,
    currentPlayingIndex,
    stopPlayingAudio,
    replayAudio,
    setMessages,
    setIsLoading,
    setPageNumber,
    setIsRecording,
    setTtsController,
    setIsAudioPlaying,
    setCurrentPlayingIndex,
  } = useChatContext();
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [starRating, setStarRating] = useState(0);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [_, setRecognizer] = useState<TranslationRecognizer>();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current && !isChatLoading && !isLoadingMore) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages, messagesEndRef, isChatLoading, isLoadingMore]);

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

  const defaultOptionsForChatLoading = {
    loop: true,
    autoplay: true,
    animationData: chatAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleRatingClick = (rating: number) => {
    setStarRating(rating);
  };

  const handleStopReplay = () => stopPlayingAudio();

  const handleReplayClick = (index: number) =>
    replayAudio(index, language, voice);

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

    if (inputValue.trim() === "") {
      toast.error("Please enter a valid question");
      return;
    }

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

  const handleUpVote = (id: string) => {
    setMessages((prevMsgs) => {
      const index = messages.findIndex((message) => message.id === id);
      const newMsgs = [...prevMsgs];
      const currentMsg = newMsgs[index];
      voteApi(sessionId, currentMsg.id, 1);
      currentMsg.vote = 1;
      return newMsgs;
    });

    toast.success("Thank you for your feedback!");
  };

  const handleDownVote = (id: string) => {
    setMessages((prevMsgs) => {
      const index = messages.findIndex((message) => message.id === id);
      const newMsgs = [...prevMsgs];
      const currentMsg = newMsgs[index];
      voteApi(sessionId, currentMsg.id, -1);
      currentMsg.vote = -1;
      return newMsgs;
    });

    toast.success("Thank you for your feedback!");
  };

  const getMobileValues = () => {
    let lang = "Hi";
    let locat = "MP";
    switch (language.toLowerCase()) {
      case "english":
        lang = "En";
        break;

      case "tamil":
        lang = "Ta";
        break;

      case "kannada":
        lang = "Kn";
        break;
    }

    switch (location.toLowerCase()) {
      case "karnataka":
        locat = "KA";
        break;

      case "tamil nadu":
        locat = "TN";
        break;
    }
    return {
      language: lang,
      location: locat,
    };
  };

  const handleNewChat = () => {
    setPrefModal(true);
    setSideBarOpen(false);
  };

  const handleLoadMore = () => {
    // scroll to top
    setIsLoadingMore(true);
    setPageNumber(pageNumber + 1);
  };

  return (
    <main
      className={`flex transition-all duration-300 ease-in-out flex-col justify-end pt-6 pl-6 pr-6 ${prefModal && "blur pointer-events-none"
        }`}
    >
      <Sidebar />
      <header className="flex gap-2 md:justify-between">
        <h2
          className={`text-red-saathi text-[24px] mt-2 md:mt-0 md:text-[48px] not-italic ml-12 md:ml-20 z-50 font-bold leading-[normal] transition-all duration-500 ease-in-out ${sideBarOpen && "md:ml-[240px]"
            }`}
        >
          SAATHI
        </h2>
        <div className="flex w-full justify-between md:justify-end">
          <div className="flex flex-col text-sm text-[#455a64]">
            <div className="flex gap-1 md:gap-2 items-center">
              <IoLocationOutline
                color="#ff725e"
                className="text-sm md:text-2xl"
              />
              <p className="block md:hidden">{getMobileValues().location}</p>
              <p className="hidden md:block">{location}</p>
            </div>
            <div className="flex gap-1 md:gap-2 items-center">
              <IoLanguage color="#ff725e" className="text-sm md:text-2xl" />
              <p className="block md:hidden">{getMobileValues().language}</p>
              <p className="hidden md:block">{language}</p>
            </div>
          </div>
          {messages.length > 0 ? (
            <div
              onClick={handleNewChat}
              className="flex md:hidden items-center justify-center bg-[#dbdbdb] h-8 w-8 rounded-full"
            >
              <FaPlus size={20} color="#7b7b7b" />
            </div>
          ) : null}
        </div>
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
                    className={`p-2 text-4xl  ${starRating >= rating ? "text-yellow-500" : "text-gray-300"
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
        className={`h-[calc(100vh-280px)] md:h-[calc(100vh-400px)] lg:h-[calc(100vh-350px)] ml-0 mt-10 overflow-auto transition-all duration-500 ${sideBarOpen ? "md:ml-[240px]" : "md:ml-20"
          }`}
        ref={messagesEndRef}
      >
        {isRecentConv && !isChatLoading && messages.length >= 5 && (
          <div className="flex justify-center">
            <div
              onClick={() => handleLoadMore()}
              className={`text-[#7b7b7b] font-medium py-2 px-4 bg-[#dbdbdb] rounded-[40px] my-2 cursor-pointer ${fetchedAllChats ? "pointer-events-none opacity-50" : ""
                }`}
            >
              {fetchedAllChats ? "All Fetched" : "Load More"}
            </div>
          </div>
        )}

        {isChatLoading ? (
          <div>
            <Lottie
              options={defaultOptionsForChatLoading}
              height={250}
              width={250}
            />
          </div>
        ) : messages.length ? (
          messages.map((messageObj, index) => (
            <div key={index} className="flex flex-col w-full py-4 px-1">
              <div className="flex items-end ml-auto mb-4 max-w-[80%] md:max-w-[70%]">
                <div className="p-3 rounded-[30px_30px_0px_30px] bg-[#ff725e]">
                  <div className="text-white text-sm md:text-xl lg:text-lg not-italic font-medium leading-[normal]">
                    {showQuestion(messageObj)}
                  </div>
                </div>
                <div className="hidden ml-1 md:block">
                  <Image
                    src={profile}
                    className="min-w-10"
                    alt="profile"
                    height={36}
                    width={36}
                  />
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
                          height={40}
                          width={40}
                        />
                      </div>
                      <div className="w-[70%] md:w-1/2 p-3 rounded-[30px_30px_30px_0px] bg-[#FFCBC366] text-gray-700">
                        <div className="text-sm md:text-xl lg:text-lg not-italic font-medium leading-[normal] break-words">
                          <Markdown className="markdown-res">
                            {messageObj.answer}
                          </Markdown>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end w-1/2 mt-1 md:ml-8">
                      <div className="mt-1">
                        {messageObj.vote === -1 ? (
                          <div className="flex gap-3 text-red-saathi text-md md:text-2xl mr-4 items-center">
                            <Image
                              src={thumbsUpOutline}
                              alt="thumbsUp"
                              className="w-6 h-6 md:w-6 md:h-6 cursor-pointer"
                              onClick={() => handleUpVote(messageObj.id)}
                            />
                            <Image
                              src={thumbsDown}
                              alt="thumbsDown"
                              className="w-7 h-7 md:w-7 md:h-7 cursor-pointer"
                              onClick={() => handleDownVote(messageObj.id)}
                            />
                          </div>
                        ) : messageObj.vote === 1 ? (
                          <div className="flex gap-3 text-red-saathi text-md md:text-2xl mr-4 items-center">
                            <Image
                              src={thumbsUp}
                              alt="thumbsUp"
                              className="w-7 h-7 md:w-7 md:h-7 cursor-pointer"
                              onClick={() => handleUpVote(messageObj.id)}
                            />
                            <Image
                              src={thumbsDownOutline}
                              alt="thumbsDown"
                              className="w-6 h-6 md:w-6 md:h-6 cursor-pointer"
                              onClick={() => handleDownVote(messageObj.id)}
                            />
                          </div>
                        ) : (
                          <div className="flex gap-3 text-red-saathi text-md md:text-2xl mr-4 items-center">
                            <Image
                              src={thumbsUpOutline}
                              alt="thumbsUp"
                              className="w-6 h-6 md:w-6 md:h-6 cursor-pointer"
                              onClick={() => handleUpVote(messageObj.id)}
                            />
                            <Image
                              src={thumbsDownOutline}
                              alt="thumbsDownOutline"
                              className="w-6 h-6 md:w-6 md:h-6 cursor-pointer"
                              onClick={() => handleDownVote(messageObj.id)}
                            />
                          </div>
                        )}
                      </div>

                      {isAudioPlaying && index === currentPlayingIndex ? (
                        <button
                          className="flex items-center text-sm md:text-lg"
                          onClick={handleStopReplay}
                        >
                          <Image
                            src={stopSvg}
                            alt="stopSvg"
                            className="mr-1 w-4 h-4"
                          />
                          Stop
                        </button>
                      ) : (
                        <button
                          className="flex items-center text-sm md:text-lg"
                          onClick={() => handleReplayClick(index)}
                        >
                          <Image
                            src={replaySvg}
                            alt="replaySvg"
                            className="mr-1 w-4 h-4"
                          />
                          Replay
                        </button>
                      )}
                    </div>
                  </>
                )
              )}
            </div>
          ))
        ) : (
          <NewConv isNewUser={isNewUser} conversations={conv.slice(0, 2)} />
        )}
      </div>

      <footer>
        <div
          className={`flex flex-col items-center z-10 md:ml-20 justify-center transition-all duration-500 ease-in-out ${sideBarOpen && "md:ml-[240px]"
            }`}
        >
          {isRecording ? (
            <div
              onClick={() => setIsRecording(false)}
              className="h-24 w-24 md:h-28 md:w-28 z-20"
            >
              <Lottie options={defaultOptions} />
            </div>
          ) : (
            <div
              className={`flex flex-col z-10 items-center gap-4 ${isAudioPlaying || isLoading
                  ? "opacity-50 pointer-events-none"
                  : ""
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
                  className="hidden md:block h-24 md:w-24"
                  src={chatMicrophone}
                  alt="chatMicrophone.svg"
                />
                <Image
                  className="block md:hidden h-16 w-16"
                  src={chatMicrophoneMobile}
                  alt="chatMicrophone.svg"
                />
              </div>
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isLoading) return;
              handleSubmit();
            }}
            className="relative flex justify-center items-center gap-2 w-full max-w-[740px] pl-4 md:pl-8 pr-2 md:pr-6 pt-6 md:pt-9 pb-4 -mt-9 bg-[#f1f1f1] rounded-[20px]"
          >
            <input
              id="question"
              type="text"
              placeholder="Ask any question here"
              className="rounded-[20px] z-10 h-[40px] md:h-[60px] w-full focus:outline-[#7b7b7b] text-sm md:text-2xl bg-[#e9e9e9] py-2 px-3"
            />
            <div
              onClick={() => {
                if (isLoading) return;
                handleSubmit();
              }}
            >
              <Image
                src={submitBtn}
                className={`cursor-pointer active:scale-90 transition-all duration-150 ${isLoading || isRecording ? "opacity-50 pointer-events-none" : ""
                  }`}
                alt="submitBtn"
                height={30}
                width={30}
              />
            </div>
          </form>
        </div>
      </footer>
    </main>
  );
};

export default withPageAuthRequired(ChatPage);
