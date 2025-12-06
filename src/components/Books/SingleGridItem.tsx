"use client";

import React, { useState } from "react";
import Image from "next/image";

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

interface SingleGridItemProps {
  item: Book;
  onViewBook: (book: Book) => void;
}

const SingleGridItem: React.FC<SingleGridItemProps> = ({ item, onViewBook }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group rounded-md border border-gray-3 bg-white transition hover:shadow-md overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden rounded-t-md bg-gray-1">
        <img
          src={item.image || "/images/products/product-01.jpg"}
          alt={item.title}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>

      {/* Content Container */}
      <div className="p-4">
        {/* Title */}
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-dark">
          {item.title}
        </h3>

        {/* Author */}
        <p className="mb-3 text-xs text-gray-5">
          {item.author?.name || "Unknown Author"}
        </p>

        {/* Category and Year */}
        <p className="mb-4 text-xs text-gray-4">
          {item.category} • {item.publishedYear}
        </p>

        {/* Button */}
        <button
          onClick={() => onViewBook(item)}
          className={`w-full rounded py-2 text-xs font-semibold transition ${
            isHovered
              ? "bg-blue text-white"
              : "border border-blue text-blue hover:bg-blue hover:text-white"
          }`}
        >
          {isHovered ? "View Book" : "View Book"}
        </button>
      </div>
    </div>
  );
};

export default SingleGridItem;
