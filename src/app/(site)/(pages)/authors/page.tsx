import React from "react";
import Authors from "@/components/Authors"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authors | Library Management System",
  description: "Browse and manage library authors",
  // other metadata
};

const AuthorsPage = () => {
  return (
    <main>
      <Authors />
    </main>
  );
};

export default AuthorsPage;
