"use client";

import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

import { textToSpeech } from "../util";
import { Conversation, Message } from "../../../types";
import { useGlobalContext } from "../../../hooks/context";
import { getConversationMsgs, getConversations } from "../../../services";
import { toast } from "react-toastify";

interface ChatContextType {
  fetchedAllChats: boolean;
  setFetchedAllChats: Dispatch<SetStateAction<boolean>>;
  isRecentConv: boolean;
  setIsRecentConv: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
  isRecording: boolean;
  isAudioPlaying: boolean;
  messages: Message[];
  conv: Conversation[];
  currentPlayingIndex: number | undefined;
  ttsController: sdk.SpeakerAudioDestination | null;
  defaultMsgIsPlaying: boolean;
  defaultMsgPlayer: sdk.SpeakerAudioDestination | null;
  isCancelled: boolean;
  replayAudio: (index: number, language: string, voice: string) => void;
  stopPlayingAudio: () => void;
  setConv: Dispatch<SetStateAction<Conversation[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsAudioPlaying: Dispatch<SetStateAction<boolean>>;
  setIsRecording: Dispatch<SetStateAction<boolean>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  setCurrentPlayingIndex: Dispatch<SetStateAction<number | undefined>>;
  setTtsController: Dispatch<
    SetStateAction<sdk.SpeakerAudioDestination | null>
  >;
  setDefaultMsgIsPlaying: Dispatch<SetStateAction<boolean>>;
  setDefaultMsgPlayer: Dispatch<
    SetStateAction<sdk.SpeakerAudioDestination | null>
  >;
  setIsCancelled: Dispatch<SetStateAction<boolean>>;
  openConversation: (
    conversation_id: string,
    conversationLocation: string,
    conversationLanguage: string,
  ) => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType);

interface Props {
  children: ReactNode;
}

export const ChatProvider: FC<Props> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number>();
  const [ttsController, setTtsController] =
    useState<sdk.SpeakerAudioDestination | null>(null);
  const [defaultMsgIsPlaying, setDefaultMsgIsPlaying] = useState(false);
  const [defaultMsgPlayer, setDefaultMsgPlayer] =
    useState<sdk.SpeakerAudioDestination | null>(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const [conv, setConv] = useState<Conversation[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isRecentConv, setIsRecentConv] = useState(false);
  const [fetchedAllChats, setFetchedAllChats] = useState(false);
  const {
    sessionId,
    setIsChatLoading,
    setLanguage,
    setLocation,
    setSideBarOpen,
    setSessionId,
  } = useGlobalContext();

  const replayAudio = (index: number, language: string, voice: string) => {
    if (currentPlayingIndex !== null || isAudioPlaying) {
      stopPlayingAudio();
    }

    if (messages[index]) {
      const currentMessage = messages[index];

      const textToSpeak = currentMessage.answer;

      const controller = textToSpeech(
        textToSpeak,
        language,
        voice,
        () => {
          setIsAudioPlaying(true);
        },
        () => {
          setIsAudioPlaying(false);
        },
      );

      setCurrentPlayingIndex(index);
      setTtsController(controller.player);
    }
  };

  const stopPlayingAudio = () => {
    ttsController?.pause();
    ttsController?.close(() => {
      setIsAudioPlaying(false);
    });

    setCurrentPlayingIndex(undefined);
    setTtsController(null);
  };

  const setMessageResponse = (
    messsageObjList: any[],
    conversation_id: string,
  ) => {
    const newMessages = messsageObjList.map((messageObj) => {
      const {
        query_id,
        english_query,
        english_response,
        language_query,
        feedback,
        language_response,
      } = messageObj;

      const mesgConv = conv.find(
        (conv) => conv.conversation_id === conversation_id,
      );

      const questionObj = {
        englishText: english_query,
        hindiText: "",
        kannadaText: "",
        tamilText: "",
        audio: "",
      };

      let answer = english_response;

      if (mesgConv) {
        switch (mesgConv?.conversation_language.toLowerCase()) {
          case "hindi":
            questionObj.hindiText = language_query;
            answer = language_response;
            break;

          case "kannada":
            questionObj.kannadaText = language_query;
            answer = language_response;
            break;

          case "tamil":
            questionObj.tamilText = language_query;
            answer = language_response;
            break;
        }
      }

      return {
        id: query_id,
        question: questionObj,
        answer,
        isLoading: false,
        vote: feedback,
      };
    });

    return newMessages;
  };

  useEffect(() => {
    if (pageNumber > 1) {
      getChatConv(sessionId);
    }
  }, [pageNumber]);

  const getChatConv = async (conversation_id: string) => {
    const res = await getConversationMsgs({
      conversation_id,
      page: pageNumber,
      page_size: 5,
    });

    if (res.data.paginated_messages.length < 4) {
      setFetchedAllChats(true);
    } else {
      setFetchedAllChats(false);
    }
    if (res.error) {
      toast.error(res.error, {
        autoClose: 5000,
        position: "top-right",
      });
      return;
    }

    if (res.data.paginated_messages) {
      const newMsg = setMessageResponse(
        res.data.paginated_messages,
        conversation_id,
      );
      if (conversation_id === sessionId) {
        setMessages([...newMsg, ...messages]);
      } else {
        setMessages([...newMsg]);
      }
    }

    return res;
  };

  const openConversation = async (
    conversation_id: string,
    conversationLocation: string,
    conversationLanguage: string,
  ) => {
    try {
      setIsLoading(true);
      setIsChatLoading(true);
      setSideBarOpen(false);
      setSessionId(conversation_id);
      await getChatConv(conversation_id);

      setLocation(conversationLocation);
      setLanguage(conversationLanguage);
      setIsLoading(false);

      const selectedConv = conv.find(
        (conv) => conv.conversation_id === conversation_id,
      );

      if (selectedConv) {
        const conversations = await getConversations({
          page: 1,
          page_size: 10,
        });
        const newConv = [...conversations.data.conversations];

        // delete selectedConv
        newConv.splice(
          newConv.findIndex(
            (c) => c.conversation_id === selectedConv.conversation_id,
          ),
          1,
        );

        newConv.unshift(selectedConv);
        setConv(newConv);
      }

      setIsChatLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        fetchedAllChats,
        setFetchedAllChats,
        isRecentConv,
        setIsRecentConv,
        pageNumber,
        setPageNumber,
        isRecording,
        isAudioPlaying,
        isLoading,
        messages,
        conv,
        currentPlayingIndex,
        ttsController,
        defaultMsgIsPlaying,
        defaultMsgPlayer,
        isCancelled,
        replayAudio,
        stopPlayingAudio,
        setIsLoading,
        setIsAudioPlaying,
        setIsRecording,
        setMessages,
        setCurrentPlayingIndex,
        setTtsController,
        setDefaultMsgIsPlaying,
        setDefaultMsgPlayer,
        setIsCancelled,
        setConv,
        openConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
