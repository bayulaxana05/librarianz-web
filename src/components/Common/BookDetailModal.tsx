"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBookDetailModalContext } from "@/app/context/BookDetailModalContext";
import { API_ENDPOINTS } from "@/utils/api";

const BookDetailModal = () => {
  const router = useRouter();
  const { isBookDetailModalOpen, selectedBook, closeBookDetailModal } =
    useBookDetailModalContext();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const modal = document.getElementById("book-detail-modal");
      if (modal && e.target === modal) {
        closeBookDetailModal();
      }
    };

    if (isBookDetailModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isBookDetailModalOpen, closeBookDetailModal]);

  if (!isBookDetailModalOpen || !selectedBook) {
    return null;
  }

  const handleDeleteBook = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete the book "${title}"?`)) {
      return;
    }

    try {
        const resp = await fetch(`${API_ENDPOINTS.BOOKS}/${id}`, {
          method: "DELETE",
        });
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(text || "Failed to delete book");
        }
        closeBookDetailModal();
        window.dispatchEvent(new Event("books:refresh"));
    } catch (error) {
        console.error("Error deleting book:", error);
        alert(
          error instanceof Error
            ? `Error deleting book: ${error.message}`
            : "An unknown error occurred while deleting the book."
        );
    }
  };

  return (
    <div
      id="book-detail-modal"
      className={`${
        isBookDetailModalOpen ? "z-99999" : "hidden"
      } fixed inset-0 flex items-center justify-center bg-dark/70 sm:px-8 px-4 py-5`}
    >
      <div className="modal-content relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 md:p-8">
        {/* Close Button */}
        <button
          onClick={closeBookDetailModal}
          className="absolute right-4 top-4 text-2xl text-gray-5 hover:text-dark"
        >
          ✕
        </button>

        {/* Modal Content */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Book Image */}
          <div className="flex items-center justify-center">
            <div className="h-64 w-48 overflow-hidden rounded-lg bg-gray-1">
              <img
                src={selectedBook.image || "/images/products/product-01.jpg"}
                alt={selectedBook.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Book Details */}
          <div>
            <h2 className="mb-4 text-2xl font-bold text-dark">
              {selectedBook.title}
            </h2>

            {/* Author */}
            <div className="mb-4">
              <p className="text-xs text-gray-5 uppercase tracking-wide">Author</p>
              <p className="text-base font-semibold text-dark">
                {selectedBook.author?.name || "Unknown"}
              </p>
            </div>

            {/* Category */}
            <div className="mb-4">
              <p className="text-xs text-gray-5 uppercase tracking-wide">Category</p>
              <p className="text-base font-semibold text-dark">
                {selectedBook.category}
              </p>
            </div>

            {/* Published Year */}
            <div className="mb-6">
              <p className="text-xs text-gray-5 uppercase tracking-wide">Published</p>
              <p className="text-base font-semibold text-dark">
                {selectedBook.publishedYear}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  closeBookDetailModal();
                  router.push(`/books/${selectedBook.id}`);
                }}
                className="flex-1 rounded bg-blue px-4 py-3 font-semibold text-white transition hover:bg-blue-dark"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteBook(selectedBook.id, selectedBook.title)}
                className="flex-1 rounded bg-gray-1 px-4 py-3 font-semibold text-dark transition hover:bg-gray-3"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;
