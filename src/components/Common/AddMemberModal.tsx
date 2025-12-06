"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/utils/api";
import { useAddMemberModalContext } from "@/app/context/AddMemberModalContext";

interface MemberFormData {
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  address: string;
}

const AddMemberModal = () => {
  const router = useRouter();
  const { isAddMemberModalOpen, closeAddMemberModal } = useAddMemberModalContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<MemberFormData>({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.name || !formData.username || !formData.email || !formData.phoneNumber || !formData.address) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.MEMBERS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to create member");
      }

      // Reset form
      setFormData({
        name: "",
        username: "",
        email: "",
        phoneNumber: "",
        address: "",
      });

      alert("Member created successfully!");
      closeAddMemberModal();
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Error creating member:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAddMemberModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-dark/70"
        onClick={closeAddMemberModal}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-dark">Add New Member</h2>
          <button
            onClick={closeAddMemberModal}
            className="text-dark-2 hover:text-dark transition"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="name" className="block mb-2.5 font-medium text-dark">
              Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Member name"
              className="w-full rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="username" className="block mb-2.5 font-medium text-dark">
              Username <span className="text-red">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="w-full rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="block mb-2.5 font-medium text-dark">
              Email <span className="text-red">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email address"
              className="w-full rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="phoneNumber" className="block mb-2.5 font-medium text-dark">
              Phone Number <span className="text-red">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone number"
              className="w-full rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="address" className="block mb-2.5 font-medium text-dark">
              Address <span className="text-red">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Member address"
              rows={3}
              className="w-full rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue text-white font-medium py-2.5 px-5 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Member"}
            </button>
            <button
              type="button"
              onClick={closeAddMemberModal}
              className="flex-1 bg-gray-1 text-dark font-medium py-2.5 px-5 rounded-md ease-out duration-200 hover:bg-gray-3"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
