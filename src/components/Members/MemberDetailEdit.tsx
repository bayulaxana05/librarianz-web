"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/utils/api";
import Breadcrumb from "../Common/Breadcrumb";

interface MemberData {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  address: string;
}

interface BorrowedBook {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowDate: string;
  returnDate: string | null;
}

interface MemberWithBorrowedDto {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  address: string;
  borrowedBooks: BorrowedBook[];
}

const MemberDetailEdit: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [member, setMember] = useState<MemberWithBorrowedDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<MemberData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        const url = `${API_ENDPOINTS.MEMBERS}/${id}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        setMember(data);
        setFormData({
          id: data.id,
          name: data.name,
          username: data.username,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
        });
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        console.error("Fetch error:", errorMessage, err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMember();
    }
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleUpdateMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) {
        return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(`${API_ENDPOINTS.MEMBERS}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update member");
      }

      const updatedMember = await response.json();
      setMember(updatedMember);
      setError(null);
      alert("Member updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMember = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete member "${member?.name}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`${API_ENDPOINTS.MEMBERS}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete member");
      }

      alert("Member deleted successfully!");
      router.push("/members");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      alert(`Delete failed: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Breadcrumb title="Member Details" pages={["members"]} />
        <div className="py-20 flex items-center justify-center bg-gray-2 min-h-screen">
          <p className="text-dark">Loading member details...</p>
        </div>
      </>
    );
  }

  if (error || !member) {
    console.error("MemberDetailEdit Error:", { error, member, id, apiEndpoint: API_ENDPOINTS.MEMBERS });
    return (
      <>
        <Breadcrumb title="Member Details" pages={["members"]} />
        <div className="py-20 flex items-center justify-center bg-gray-2 min-h-screen">
          <div className="bg-white p-6 rounded-lg shadow-1">
            <p className="text-red font-medium mb-4">{error || "Member not found"}</p>
            <p className="text-dark-2 text-sm">Member ID: {id}</p>
            <p className="text-dark-2 text-sm">API Endpoint: {API_ENDPOINTS.MEMBERS}/{id}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title="Member Details" pages={["members"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-col xl:flex-row gap-7.5">
          {/* Left Navigation Column */}
          <div className="xl:max-w-[370px] w-full bg-white rounded-xl shadow-1">
            <div className="flex xl:flex-col">
              {/* Member Header Card - Hidden on small screens */}
              <div className="hidden lg:flex flex-wrap items-center gap-5 py-6 px-4 sm:px-7.5 xl:px-9 border-r xl:border-r-0 xl:border-b border-gray-3">
                <div className="max-w-[64px] w-full h-16 rounded-full overflow-hidden bg-gray-1 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div>
                  <p className="font-medium text-dark mb-0.5">{member.name}</p>
                  <p className="text-custom-xs">Username: {member.username}</p>
                </div>
              </div>

              {/* Tab Navigation Buttons */}
              <div className="p-4 sm:p-7.5 xl:p-9">
                <div className="flex flex-wrap xl:flex-nowrap xl:flex-col gap-4">
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
                      activeTab === "details"
                        ? "text-white bg-blue"
                        : "text-dark-2 bg-gray-1"
                    }`}
                  >
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.9995 1.14581C8.59473 1.14581 6.64531 3.09524 6.64531 5.49998C6.64531 7.90472 8.59473 9.85415 10.9995 9.85415C13.4042 9.85415 15.3536 7.90472 15.3536 5.49998C15.3536 3.09524 13.4042 1.14581 10.9995 1.14581ZM8.02031 5.49998C8.02031 3.85463 9.35412 2.52081 10.9995 2.52081C12.6448 2.52081 13.9786 3.85463 13.9786 5.49998C13.9786 7.14533 12.6448 8.47915 10.9995 8.47915C9.35412 8.47915 8.02031 7.14533 8.02031 5.49998Z"
                        fill=""
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.9995 11.2291C8.87872 11.2291 6.92482 11.7112 5.47697 12.5256C4.05066 13.3279 2.97864 14.5439 2.97864 16.0416L2.97858 16.1351C2.97754 17.2001 2.97624 18.5368 4.14868 19.4916C4.7257 19.9614 5.53291 20.2956 6.6235 20.5163C7.71713 20.7377 9.14251 20.8541 10.9995 20.8541C12.8564 20.8541 14.2818 20.7377 15.3754 20.5163C16.466 20.2956 17.2732 19.9614 17.8503 19.4916C19.0227 18.5368 19.0214 17.2001 19.0204 16.1351L19.0203 16.0416C19.0203 14.5439 17.9483 13.3279 16.522 12.5256C15.0741 11.7112 13.1202 11.2291 10.9995 11.2291ZM4.35364 16.0416C4.35364 15.2612 4.92324 14.4147 6.15108 13.724C7.35737 13.0455 9.07014 12.6041 10.9995 12.6041C12.9288 12.6041 14.6416 13.0455 15.8479 13.724C17.0757 14.4147 17.6453 15.2612 17.6453 16.0416C17.6453 17.2405 17.6084 17.9153 16.982 18.4254C16.6424 18.702 16.0746 18.9719 15.1027 19.1686C14.1338 19.3648 12.8092 19.4791 10.9995 19.4791C9.18977 19.4791 7.86515 19.3648 6.89628 19.1686C5.92437 18.9719 5.35658 18.702 5.01693 18.4254C4.39059 17.9153 4.35364 17.2405 4.35364 16.0416Z"
                        fill=""
                      />
                    </svg>
                    Details
                  </button>

                  <button
                    onClick={() => setActiveTab("borrowed-books")}
                    className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
                      activeTab === "borrowed-books"
                        ? "text-white bg-blue"
                        : "text-dark-2 bg-gray-1"
                    }`}
                  >
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.1875 6.38598C3.1875 3.33948 5.8286 0.9375 9 0.9375C12.1714 0.9375 14.8125 3.33948 14.8125 6.38598C14.8125 9.24433 13.0403 12.6 10.1811 13.8219C9.43046 14.1427 8.56954 14.1427 7.81891 13.8219C4.95967 12.6 3.1875 9.24433 3.1875 6.38598ZM9 2.0625C6.37241 2.0625 4.3125 4.03557 4.3125 6.38598C4.3125 8.88223 5.89157 11.7749 8.26099 12.7874C8.72925 12.9875 9.27075 12.9875 9.73901 12.7874C12.1084 11.7749 13.6875 8.88223 13.6875 6.38598C13.6875 4.03557 11.6276 2.0625 9 2.0625Z"
                        fill=""
                      />
                    </svg>
                    Borrowed Books
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Column */}
          <div className="xl:max-w-[770px] w-full">
            {/* Details Tab */}
            <div
              className={`bg-white rounded-xl shadow-1 py-9.5 px-4 sm:px-7.5 xl:px-10 ${
                activeTab === "details" ? "block" : "hidden"
              }`}
            >
              <form onSubmit={handleUpdateMember}>
                <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                  <div className="w-full">
                    <label htmlFor="name" className="block mb-2.5">
                      Name <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Member name"
                      value={formData?.name || ""}
                      onChange={handleInputChange}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="username" className="block mb-2.5">
                      Username <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      placeholder="Username"
                      value={formData?.username || ""}
                      onChange={handleInputChange}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                  <div className="w-full">
                    <label htmlFor="email" className="block mb-2.5">
                      Email <span className="text-red">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email address"
                      value={formData?.email || ""}
                      onChange={handleInputChange}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="phoneNumber" className="block mb-2.5">
                      Phone Number <span className="text-red">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      placeholder="Phone number"
                      value={formData?.phoneNumber || ""}
                      onChange={handleInputChange}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label htmlFor="address" className="block mb-2.5">
                    Address <span className="text-red">*</span>
                  </label>
                  <textarea
                    name="address"
                    id="address"
                    placeholder="Member address"
                    value={formData?.address || ""}
                    onChange={handleInputChange}
                    rows={4}
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Update"}
                </button>

                <button
                  type="button"
                  onClick={handleDeleteMember}
                  disabled={isDeleting}
                  className="inline-flex font-medium text-white bg-red py-3 px-7 rounded-md ease-out duration-200 hover:bg-red-dark disabled:opacity-50 disabled:cursor-not-allowed ml-3"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </form>
            </div>

            {/* Borrowed Books Tab */}
            <div
              className={`bg-white rounded-xl shadow-1 ${
                activeTab === "borrowed-books" ? "block" : "hidden"
              }`}
            >
              {member.borrowedBooks && member.borrowedBooks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-3">
                        <th className="text-left py-4 px-4 sm:px-7.5 xl:px-10 font-medium text-dark">
                          Book Title
                        </th>
                        <th className="text-left py-4 px-4 sm:px-7.5 xl:px-10 font-medium text-dark">
                          Borrow Date
                        </th>
                        <th className="text-left py-4 px-4 sm:px-7.5 xl:px-10 font-medium text-dark">
                          Return Date
                        </th>
                        <th className="text-left py-4 px-4 sm:px-7.5 xl:px-10 font-medium text-dark">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {member.borrowedBooks.map((book) => (
                        <tr key={book.id} className="border-b border-gray-3">
                          <td className="py-4 px-4 sm:px-7.5 xl:px-10 text-custom-sm">
                            {book.bookTitle}
                          </td>
                          <td className="py-4 px-4 sm:px-7.5 xl:px-10 text-custom-sm">
                            {new Date(book.borrowDate).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 sm:px-7.5 xl:px-10 text-custom-sm">
                            {book.returnDate
                              ? new Date(book.returnDate).toLocaleDateString()
                              : "Not returned"}
                          </td>
                          <td className="py-4 px-4 sm:px-7.5 xl:px-10 text-custom-sm">
                            <span
                              className={`inline-block py-1 px-3 rounded-full text-custom-xs font-medium ${
                                book.returnDate
                                  ? "bg-green-1 text-green"
                                  : "bg-yellow-1 text-yellow"
                              }`}
                            >
                              {book.returnDate ? "Returned" : "Borrowed"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-9.5 px-4 sm:px-7.5 xl:px-10 text-center text-dark-2">
                  <p>This member has no borrowed books.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default MemberDetailEdit;
