"use client";

import React, { createContext, useContext, useState } from "react";

interface GitHubContextType {
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;
}

const GitHubContext = createContext<GitHubContextType | undefined>(undefined);

export const GitHubProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <GitHubContext.Provider value={{ isConnected, setIsConnected }}>
      {children}
    </GitHubContext.Provider>
  );
};

export const useGitHub = () => {
  const context = useContext(GitHubContext);
  if (context === undefined) {
    throw new Error("useGitHub must be used within a GitHubProvider");
  }
  return context;
};
