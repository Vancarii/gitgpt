"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";

type ThemeType = "dark" | "light";

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: {
    background: string;
    accent: string;
    text: string;
    primary: string;
    secondary: string;
    card: string;
    border: string;
    codeBackground: string;
    codeForeground: string;
    buttonBackground: string;
    buttonText: string;
    inputBackground: string;
  };
  fonts: {
    regular: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeType>("dark");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const colors = {
    background: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
    accent: theme === "dark" ? "#1F6E6D" : "#1F6E6D",
    text: theme === "dark" ? "#FFFFFF" : "#000000",
    primary: theme === "dark" ? "#3E3E3E" : "#F0F0F0",
    secondary: theme === "dark" ? "#2D2D2D" : "#E0E0E0",
    card: theme === "dark" ? "#2D2D2D" : "#F5F5F5",
    border: theme === "dark" ? "#3E3E3E" : "#E0E0E0",
    codeBackground: theme === "dark" ? "#1E3A5F" : "#F0F8FF",
    codeForeground: theme === "dark" ? "#A9B7C6" : "#333333",
    buttonBackground: theme === "dark" ? "#2D2D2D" : "#F0F0F0",
    buttonText: theme === "dark" ? "#FFFFFF" : "#000000",
    inputBackground: theme === "dark" ? "#3E3E3E" : "#F5F5F5",
  };

  const fonts = {
    regular: "OPTIDanley-Medium",
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors, fonts }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
