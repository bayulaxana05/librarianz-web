import React from "react";
import Members from "@/components/Members";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members | Library Management System",
  description: "Browse and manage library members",
};

const MembersPage = () => {
  return (
    <main>
      <Members />
    </main>
  );
};

export default MembersPage;
