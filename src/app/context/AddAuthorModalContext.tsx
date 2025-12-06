"use client";
import { createContext, useContext, useState } from "react";

interface AddAuthorModalContextType {
  isAddAuthorModalOpen: boolean;
  openAddAuthorModal: () => void;
  closeAddAuthorModal: () => void;
}

const AddAuthorModalContext = createContext<AddAuthorModalContextType | undefined>(undefined);

export const useAddAuthorModalContext = () => {
  const context = useContext(AddAuthorModalContext);
  if (!context) {
    throw new Error("useAddAuthorModalContext must be used within AddAuthorModalProvider");
  }
  return context;
};

export const AddAuthorModalProvider = ({ children }) => {
  const [isAddAuthorModalOpen, setIsAddAuthorModalOpen] = useState(false);

  const openAddAuthorModal = () => {
    setIsAddAuthorModalOpen(true);
  };

  const closeAddAuthorModal = () => {
    setIsAddAuthorModalOpen(false);
  };

  return (
    <AddAuthorModalContext.Provider
      value={{ isAddAuthorModalOpen, openAddAuthorModal, closeAddAuthorModal }}
    >
      {children}
    </AddAuthorModalContext.Provider>
  );
};
