"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/utils/api";

interface Book {
  id: number;
  title: string;
  category: string;
  publishedYear: number;
  author: {
    id: number;
    name: string;
  };
  image?: string;
}

const BookDetailEdit = ({ id }: { id: string }) => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  // form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [publishedYear, setPublishedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
       
        const resp = await fetch(`${API_BASE_URL}/api/books/${id}`);
        if (!resp.ok) {
          throw new Error("Failed to fetch book");
        }
        
        const data: Book = await resp.json();
        setBook(data);
        setTitle(data.title || "");
        setCategory(data.category || "");
        setPublishedYear(data.publishedYear || new Date().getFullYear());

      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        title,
        category,
        publishedYear,
      };

      const resp = await fetch(`${API_BASE_URL}/api/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Failed to update book");
      }

      const updated: Book = await resp.json();
      setBook(updated);
      setSuccessMessage("Book updated successfully.");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Breadcrumb title={book ? book.title : "Book"} pages={["books", "detail"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-7.5">
            <div className="xl:max-w-[370px] w-full bg-white rounded-xl shadow-1">
              <div className="py-5 px-4 sm:px-7.5 border-b border-gray-3">
                <p className="font-medium text-xl text-dark">Book Detail</p>
              </div>

              <div className="p-4 sm:p-7.5">
                {loading ? (
                  <p>Loading book...</p>
                ) : error ? (
                  <p className="text-red-500">Error: {error}</p>
                ) : book ? (
                  <div className="flex flex-col gap-4">
                    <div className="mb-3 overflow-hidden rounded-lg bg-gray-1 h-48">
                      <img
                        src={book.image || "/images/products/product-01.jpg"}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <p className="text-gray-600">
                      <strong>Title:</strong> {book.title || "-"}
                    </p>

                    <p className="text-gray-600">
                      <strong>Author:</strong> {book.author?.name || "-"}
                    </p>

                    <p className="text-gray-600">
                      <strong>Category:</strong> {book.category || "-"}
                    </p>

                    <p className="text-gray-600">
                      <strong>Published Year:</strong> {book.publishedYear || "-"}
                    </p>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => router.push("/books")}
                        className="inline-flex font-medium text-white bg-gray-600 py-2 px-4 rounded-md"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>No book found.</p>
                )}
              </div>
            </div>

            <div className="xl:max-w-[770px] w-full bg-white rounded-xl shadow-1 p-4 sm:p-7.5 xl:p-10">
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="title" className="block mb-2.5">
                    Title <span className="text-red">*</span>
                  </label>
                  <input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    required
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="category" className="block mb-2.5">
                    Category <span className="text-red">*</span>
                  </label>
                  <input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    type="text"
                    required
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                  <div className="w-full">
                    <label htmlFor="publishedYear" className="block mb-2.5">
                      Published Year <span className="text-red">*</span>
                    </label>
                    <input
                      id="publishedYear"
                      type="number"
                      value={publishedYear}
                      onChange={(e) => setPublishedYear(parseInt(e.target.value, 10))}
                      required
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 mb-3">{error}</p>}
                {successMessage && (
                  <p className="text-green-600 mb-3">{successMessage}</p>
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // reset to fetched values
                      if (book) {
                        setTitle(book.title || "");
                        setCategory(book.category || "");
                        setPublishedYear(book.publishedYear || new Date().getFullYear());
                        setSuccessMessage(null);
                        setError(null);
                      }
                    }}
                    className="inline-flex font-medium text-dark bg-gray-1 py-3 px-5 rounded-md"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BookDetailEdit;
