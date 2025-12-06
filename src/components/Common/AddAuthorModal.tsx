"use client";
import React, { useState, useEffect } from "react";
import { useAddAuthorModalContext } from "@/app/context/AddAuthorModalContext";
import { API_ENDPOINTS } from "@/utils/api";

interface AddAuthorForm {
  name: string;
  biography: string;
  website: string;
  birthDate: string;
}

const AddAuthorModal = ({ onAuthorAdded }: { onAuthorAdded?: () => void }) => {
  const { isAddAuthorModalOpen, closeAddAuthorModal } = useAddAuthorModalContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<AddAuthorForm>({
    name: "",
    biography: "",
    website: "",
    birthDate: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (!formData.name.trim()) {
      setError("Author name is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_ENDPOINTS.AUTHORS}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to add author");
      }

      setSuccessMessage("Author added successfully!");
      
      // Reset form
      setFormData({
        name: "",
        biography: "",
        website: "",
        birthDate: "",
      });

      // Close modal after a short delay
      setTimeout(() => {
        closeAddAuthorModal();
        onAuthorAdded?.();
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    // Reset form when closing
    setFormData({
      name: "",
      biography: "",
      website: "",
      birthDate: "",
    });
    setError(null);
    setSuccessMessage(null);
    closeAddAuthorModal();
  };

  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (
        event.target &&
        !(event.target as HTMLElement).closest(".modal-content")
      ) {
        closeAddAuthorModal();
        setFormData({
          name: "",
          biography: "",
          website: "",
          birthDate: "",
        });
        setError(null);
        setSuccessMessage(null);
      }
    }

    if (isAddAuthorModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAddAuthorModalOpen, closeAddAuthorModal]);

  return (
    <div
      className={`${
        isAddAuthorModalOpen ? "z-99999" : "hidden"
      } fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-[230px] bg-dark/70 sm:px-8 px-4 py-5`}
    >
      <div className="flex items-center justify-center">
        <div className="modal-content bg-white rounded-[10px] max-w-[600px] w-full shadow-1">
          <div className="sticky top-0 bg-white flex items-center justify-between pb-5 pt-7.5 px-7.5 border-b border-gray-3">
            <h2 className="font-medium text-dark text-lg sm:text-2xl">
              Add New Author
            </h2>
            <button
              onClick={handleCloseModal}
              aria-label="button for close modal"
              className="flex items-center justify-center ease-in duration-150 bg-meta text-dark-5 hover:text-dark"
            >
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.5948 13.1242C14.7627 13.2921 14.7627 13.5636 14.5948 13.7315L12.3521 15.9742C12.1842 16.1421 11.9127 16.1421 11.7448 15.9742L10.0006 14.2299L8.25633 15.9742C8.08841 16.1421 7.81695 16.1421 7.64903 15.9742L5.40636 13.7315C5.23844 13.5636 5.23844 13.2921 5.40636 13.1242L7.14903 11.3799L5.40636 9.63563C5.23844 9.46771 5.23844 9.19625 5.40636 9.02834L7.64903 6.78567C7.81695 6.61775 8.08841 6.61775 8.25633 6.78567L10.0006 8.52834L11.7448 6.78567C11.9127 6.61775 12.1842 6.61775 12.3521 6.78567L14.5948 9.02834C14.7627 9.19625 14.7627 9.46771 14.5948 9.63563L12.8505 11.3799L14.5948 13.1242Z"
                  fill=""
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-7.5">
            <div className="mb-5">
              <label htmlFor="name" className="block mb-2.5">
                Name <span className="text-red">*</span>
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                type="text"
                required
                placeholder="Enter author name"
                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="biography" className="block mb-2.5">
                Biography
              </label>
              <textarea
                id="biography"
                name="biography"
                value={formData.biography}
                onChange={handleInputChange}
                rows={4}
                placeholder="Enter author biography"
                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
              <div className="w-full">
                <label htmlFor="website" className="block mb-2.5">
                  Website
                </label>
                <input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="https://example.com"
                  className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
              </div>

              <div className="w-full">
                <label htmlFor="birthDate" className="block mb-2.5">
                  Birth Date
                </label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
              </div>
            </div>

            {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
            {successMessage && (
              <p className="text-green-600 mb-3 text-sm">{successMessage}</p>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex font-medium text-white bg-blue py-2.5 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-60"
              >
                {loading ? "Adding..." : "Add Author"}
              </button>

              <button
                type="button"
                onClick={handleCloseModal}
                className="inline-flex font-medium text-dark bg-gray-1 py-2.5 px-6 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAuthorModal;
