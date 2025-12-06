"use client";
import { createContext, useContext, useState } from "react";

interface AddMemberModalContextType {
  isAddMemberModalOpen: boolean;
  openAddMemberModal: () => void;
  closeAddMemberModal: () => void;
}

const AddMemberModalContext = createContext<AddMemberModalContextType | undefined>(undefined);

export const useAddMemberModalContext = () => {
  const context = useContext(AddMemberModalContext);
  if (!context) {
    throw new Error(
      "useAddMemberModalContext must be used within AddMemberModalProvider"
    );
  }
  return context;
};

export const AddMemberModalProvider = ({ children }) => {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const openAddMemberModal = () => setIsAddMemberModalOpen(true);
  const closeAddMemberModal = () => setIsAddMemberModalOpen(false);

  return (
    <AddMemberModalContext.Provider
      value={{ isAddMemberModalOpen, openAddMemberModal, closeAddMemberModal }}
    >
      {children}
    </AddMemberModalContext.Provider>
  );
};
