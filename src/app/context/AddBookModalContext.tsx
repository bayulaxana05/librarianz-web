"use client";
import React, { createContext, useContext, useState } from "react";

interface AddBookModalContextType {
  isAddBookModalOpen: boolean;
  openAddBookModal: () => void;
  closeAddBookModal: () => void;
}

const AddBookModalContext = createContext<AddBookModalContextType | undefined>(undefined);

export const useAddBookModalContext = () => {
  const context = useContext(AddBookModalContext);
  if (!context) {
    throw new Error("useAddBookModalContext must be used within AddBookModalProvider");
  }
  return context;
};

export const AddBookModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);

  const openAddBookModal = () => {
    setIsAddBookModalOpen(true);
  };

  const closeAddBookModal = () => {
    setIsAddBookModalOpen(false);
  };

  return (
    <AddBookModalContext.Provider
      value={{ isAddBookModalOpen, openAddBookModal, closeAddBookModal }}
    >
      {children}
    </AddBookModalContext.Provider>
  );
};
