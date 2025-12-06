"use client";

import React from "react";

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

interface SingleListItemProps {
  item: Book;
  onViewBook: (book: Book) => void;
}

const SingleListItem: React.FC<SingleListItemProps> = ({ item, onViewBook }) => {
  return (
    <div className="flex gap-4 rounded-lg bg-white shadow-1 overflow-hidden border border-gray-3">
      {/* Image */}
      <div className="h-48 w-32 flex-shrink-0 overflow-hidden bg-gray-1">
        <img
          src={item.image || "/images/products/product-01.jpg"}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        {/* Header */}
        <div>
          <h3 className="mb-2 text-lg font-semibold text-dark">
            {item.title}
          </h3>
          <p className="mb-1 text-sm text-gray-5">
            by {item.author?.name || "Unknown Author"}
          </p>
          <p className="mb-4 text-xs text-gray-4">
            {item.category} • {item.publishedYear}
          </p>
        </div>

        {/* Button */}
        <button
          onClick={() => onViewBook(item)}
          className="self-start rounded border border-blue px-6 py-2 text-sm font-semibold text-blue transition hover:bg-blue hover:text-white"
        >
          View Book
        </button>
      </div>
    </div>
  );
};

export default SingleListItem;
