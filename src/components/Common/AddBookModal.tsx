"use client";

import React, { useEffect, useState } from "react";
import { useAddBookModalContext } from "@/app/context/AddBookModalContext";
import { API_BASE_URL, API_ENDPOINTS } from "@/utils/api";
import { useRouter } from "next/navigation";

interface AuthorOption {
  id: number;
  name: string;
}

const AddBookModal: React.FC = () => {
  const { isAddBookModalOpen, closeAddBookModal } = useAddBookModalContext();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [publishedYear, setPublishedYear] = useState<number | "">("");
  const [authorId, setAuthorId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState<AuthorOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAddBookModalOpen) return;

    const fetchAuthors = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/authors?page=1&size=1000`);
        if (!res.ok) return;
        const data = await res.json();
        const items = data.content?.map((a: any) => ({ id: a.id, name: a.name })) || [];
        setAuthors(items);
      } catch (err) {
        // ignore silently
        console.error(err);
      }
    };

    fetchAuthors();
  }, [isAddBookModalOpen]);

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setPublishedYear("");
    setAuthorId("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!authorId) {
      setError("Author is required");
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        title: title.trim(),
        category: category.trim() || null,
        publishedYear: publishedYear === "" ? null : Number(publishedYear),
        author: { id: Number(authorId) },
      };

      const resp = await fetch(`${API_BASE_URL}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Failed to create book");
      }

      // success
      closeAddBookModal();
      resetForm();
      window.dispatchEvent(new Event("books:refresh"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isAddBookModalOpen) return null;

  return (
    <div className={`fixed inset-0 z-99999 flex items-center justify-center bg-dark/70 sm:px-8 px-4 py-5`}>
      <div className="modal-content relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 md:p-8">
        <button onClick={closeAddBookModal} className="absolute right-4 top-4 text-2xl text-gray-5 hover:text-dark">✕</button>

        <h3 className="mb-4 text-lg font-semibold">Add New Book</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <label className="mb-1 block text-xs font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-3 bg-gray-1 px-4 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium">Author</label>
            <select
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value ? Number(e.target.value) : "")}
              className="w-full rounded-md border border-gray-3 bg-gray-1 px-4 py-2"
            >
              <option value="">Select author</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-gray-3 bg-gray-1 px-4 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium">Published Year</label>
            <input
              type="number"
              value={publishedYear}
              onChange={(e) => setPublishedYear(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full rounded-md border border-gray-3 bg-gray-1 px-4 py-2"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading} className="rounded bg-blue px-4 py-2 text-white">
              {loading ? "Saving..." : "Add Book"}
            </button>
            <button type="button" onClick={() => { resetForm(); closeAddBookModal(); }} className="rounded border px-4 py-2">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;
