"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type GlobalContextProps = {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  prefModal: boolean;
  setPrefModal: React.Dispatch<React.SetStateAction<boolean>>;
  isNewUser: boolean;
  setNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  voice: string;
  setVoice: React.Dispatch<React.SetStateAction<string>>;
  sessionId: string;
  setSessionId: React.Dispatch<React.SetStateAction<string>>;
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  sideBarOpen: boolean;
  setSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isChatLoading: boolean;
  setIsChatLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must bee used within a GlobalProvider");
  }
  return context;
};

interface GlobalProviderProps {
  children: React.ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  // initial values
  const [language, setLanguage] = useState<string>("Hindi");
  const [voice, setVoice] = useState<string>("female");
  const [sessionId, setSessionId] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);
  const [isNewUser, setNewUser] = useState<boolean>(false);
  const [prefModal, setPrefModal] = useState<boolean>(false);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  useEffect(() => {
    // get the language from localstorage
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    const storedLocation = localStorage.getItem("location");
    if (storedLocation) {
      setLocation(storedLocation);
    }
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isChatLoading,
        setIsChatLoading,
        language,
        setLanguage,
        prefModal,
        setPrefModal,
        isNewUser,
        setNewUser,
        voice,
        setVoice,
        sessionId,
        setSessionId,
        location,
        setLocation,
        sideBarOpen,
        setSideBarOpen,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
