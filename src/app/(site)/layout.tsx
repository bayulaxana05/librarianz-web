"use client";
import { useState, useEffect } from "react";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { AddMemberModalProvider } from "../context/AddMemberModalContext";
import { AddAuthorModalProvider } from "../context/AddAuthorModalContext";
import { AddBookModalProvider } from "../context/AddBookModalContext";
import { BookDetailModalProvider } from "../context/BookDetailModalContext";
import { ReduxProvider } from "@/redux/provider";

import AddAuthorModal from "@/components/Common/AddAuthorModal";
import AddMemberModal from "@/components/Common/AddMemberModal";
import AddBookModal from "@/components/Common/AddBookModal";
import BookDetailModal from "@/components/Common/BookDetailModal";

import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        {loading ? (
          <PreLoader />
        ) : (
          <>
            <ReduxProvider>
              <AddMemberModalProvider>
                <AddAuthorModalProvider>
                  <AddBookModalProvider>
                    <BookDetailModalProvider>
                      <Header />
                      {children}
                      <AddAuthorModal />
                      <AddMemberModal />
                      <AddBookModal />
                      <BookDetailModal />
                    </BookDetailModalProvider>
                  </AddBookModalProvider>
                </AddAuthorModalProvider>
              </AddMemberModalProvider>
            </ReduxProvider>
            <ScrollToTop />
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
