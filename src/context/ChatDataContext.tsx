"use client";
import { ParsedChatData } from '@/lib/types';
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the context data
interface ChatDataContextType {
  chatData: ParsedChatData | null;
  setChatData: (data: ParsedChatData | null) => void;
  fileName: string | null;
  setFileName: (name: string | null) => void;
}

// Create the context with a default value
const ChatDataContext = createContext<ChatDataContextType | undefined>(undefined);

// Create a provider component
export const ChatDataProvider = ({ children }: { children: ReactNode }) => {
  const [chatData, setChatData] = useState<ParsedChatData | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <ChatDataContext.Provider value={{ chatData, setChatData, fileName, setFileName }}>
      {children}
    </ChatDataContext.Provider>
  );
};

// Create a custom hook for using the context
export const useChatData = () => {
  const context = useContext(ChatDataContext);
  if (context === undefined) {
    throw new Error('useChatData must be used within a ChatDataProvider');
  }
  return context;
};
