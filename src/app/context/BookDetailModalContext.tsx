"use client";
import React, { createContext, useContext, useState } from "react";

interface BookDetailModalContextType {
  isBookDetailModalOpen: boolean;
  selectedBook: any;
  openBookDetailModal: (book: any) => void;
  closeBookDetailModal: () => void;
}

const BookDetailModalContext = createContext<BookDetailModalContextType | undefined>(undefined);

export const useBookDetailModalContext = () => {
  const context = useContext(BookDetailModalContext);
  if (!context) {
    throw new Error("useBookDetailModalContext must be used within BookDetailModalProvider");
  }
  return context;
};

export const BookDetailModalProvider = ({ children }) => {
  const [isBookDetailModalOpen, setIsBookDetailModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const openBookDetailModal = (book: any) => {
    setSelectedBook(book);
    setIsBookDetailModalOpen(true);
  };

  const closeBookDetailModal = () => {
    setIsBookDetailModalOpen(false);
    setSelectedBook(null);
  };

  return (
    <BookDetailModalContext.Provider
      value={{ isBookDetailModalOpen, selectedBook, openBookDetailModal, closeBookDetailModal }}
    >
      {children}
    </BookDetailModalContext.Provider>
  );
};
