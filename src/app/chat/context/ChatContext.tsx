"use client";

import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

import { textToSpeech } from "../util";
import { Message } from "../../../types";

interface ChatContextType {
  isLoading: boolean;
  isRecording: boolean;
  isAudioPlaying: boolean;
  messages: Message[];
  currentPlayingIndex: number | undefined;
  ttsController: sdk.SpeakerAudioDestination | null;
  defaultMsgIsPlaying: boolean;
  defaultMsgPlayer: sdk.SpeakerAudioDestination | null;
  isCancelled: boolean;
  replayAudio: (index: number, language: string, voice: string) => void;
  stopPlayingAudio: () => void;
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

  return (
    <ChatContext.Provider
      value={{
        isRecording,
        isAudioPlaying,
        isLoading,
        messages,
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
