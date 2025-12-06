import React from "react";
import Books from "@/components/Books";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books | Library Management System",
  description: "Browse and manage library books",
};

const BooksPage = () => {
  return (
    <main>
      <Books />
    </main>
  );
};

export default BooksPage;
