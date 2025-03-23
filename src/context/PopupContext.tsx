import React, { createContext, useState, useContext, ReactNode } from "react";
import PopupModal from "../components/PopupModal";

interface PopupContextType {
  showPopup: (options: PopupOptions) => void;
  hidePopup: () => void;
}

interface PopupOptions {
  title?: string;
  description?: string;
  buttonText?: string;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<PopupOptions>({
    title: "We're sorry!",
    description: "This page is not available yet, please check back later",
    buttonText: "Close",
  });

  const showPopup = (newOptions: PopupOptions) => {
    setOptions({ ...options, ...newOptions });
    setVisible(true);
  };

  const hidePopup = () => {
    setVisible(false);
  };

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      <PopupModal
        visible={visible}
        onClose={hidePopup}
        title={options.title}
        description={options.description}
        buttonText={options.buttonText}
      />
    </PopupContext.Provider>
  );
};

export const usePopup = (): PopupContextType => {
  const context = useContext(PopupContext);

  if (context === undefined) {
    throw new Error("usePopup must be used within a PopupProvider");
  }

  return context;
};
