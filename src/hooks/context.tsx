"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type GlobalContextProps = {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
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
};

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

interface GlobalProviderProps {
  children: React.ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  // initial values
  const [language, setLanguage] = useState<string>("hindi");
  const [voice, setVoice] = useState<string>("female");
  const [sessionId, setSessionId] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);
  const [isNewUser, setNewUser] = useState<boolean>(false);

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
        language,
        setLanguage,
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
