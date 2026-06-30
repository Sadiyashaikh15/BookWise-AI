/**
 * BookCard.jsx — Extended Hardcover Render Block with Dynamic API Fallbacks
 * Stack: React + Tailwind v4
 * Aesthetic: Minimalist luxury book bindings with Multi-API recovery loops
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book, isFavorited, onFavoriteToggle }) => {
  const [imgSrc, setImgSrc] = useState(book.image_url);
  const [hasCheckedGoogle, setHasCheckedGoogle] = useState(false);
  const [isFallbackJacket, setIsFallbackJacket] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Synchronize internal source if parent book state fields shift
  useEffect(() => {
    setImgSrc(book.image_url);
    setIsFallbackJacket(false);
    setHasCheckedGoogle(false);
  }, [book.image_url]);

  // ─── THREE-LAYER FALLBACK CONTROLLER ───────────────────────────────────────
  const handleImageLoadError = async () => {
    // Layer 2: Try checking Google Books API using ISBN if first choice fails
    if (book.isbn && !hasCheckedGoogle) {
      setHasCheckedGoogle(true);
      try {
        const cleanIsbn = book.isbn.trim();
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`);
        const data = await response.json();

        if (data.totalItems > 0 && data.items[0].volumeInfo?.imageLinks?.thumbnail) {
          // Replace with safe, secure Google Books thumbnail links
          const secureUrl = data.items[0].volumeInfo.imageLinks.thumbnail.replace('http://', 'https://');
          setImgSrc(secureUrl);
          return;
        }
      } catch (err) {
        console.error("Google Books recovery query exception:", err);
      }
    }

    // Layer 3: If neither works, trigger premium geometric vintage default layout
    setIsFallbackJacket(true);
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onFavoriteToggle || favLoading) return;

    setFavLoading(true);
    try {
      onFavoriteToggle(book.id, !isFavorited);
    } catch (err) {
      console.error('Favorite toggle failure:', err);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="bg-[#FFFDF8] rounded-2xl border border-[#3E3024]/10 p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative group">
      
      {/* Structural Cover Image Jacket Frame */}
      <div className="relative aspect-[2/3] bg-[#F8F3EA] rounded-xl overflow-hidden border border-[#3E3024]/5 shadow-xs mb-4">
        
        {!isFallbackJacket && imgSrc ? (
          <img
            src={imgSrc}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={handleImageLoadError}
          />
        ) : (
          /* 🎨 Final Fallback Layer: Beautiful Vintage Geometric Leather Binding Jacket */
          <div className="w-full h-full bg-[#6F4E37] p-4 flex flex-col justify-between text-[#FFFDF8] relative select-none animate-fadeIn">
            {/* Bound Spine Indentation Line Accents */}
            <div className="absolute left-0 inset-y-0 w-1.5 bg-black/25" />
            <div className="absolute left-2 inset-y-0 w-px bg-white/10" />
            
            <div className="space-y-1 pl-2">
              <span className="text-[8px] font-bold tracking-widest uppercase opacity-60 block font-sans">
                {book.genre || 'Volume'}
              </span>
              <h3 className="font-serif text-xs font-bold tracking-tight leading-tight line-clamp-4">
                {book.title}
              </h3>
            </div>
            
            <p className="font-sans text-[9px] italic opacity-70 truncate pl-2">
              {book.author || 'Anonymous'}
            </p>
          </div>
        )}

        {/* Floating Heart Interaction Tag */}
        <button
          onClick={handleFavoriteClick}
          disabled={favLoading}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#FFFDF8]/90 backdrop-blur-xs border border-[#3E3024]/10 flex items-center justify-center shadow-2xs transition-transform active:scale-90 cursor-pointer z-10"
        >
          <span className={`text-xs ${isFavorited ? 'text-[#B66A50]' : 'text-[#3E3024]/30 group-hover:text-[#3E3024]/60'}`}>
            {isFavorited ? '❤️' : '♡'}
          </span>
        </button>
      </div>

      {/* Meta Text Description Ledger Section */}
      <div className="space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <span className="inline-block px-2 py-0.5 bg-[#3E3024]/5 text-[#3E3024]/60 text-[9px] font-bold uppercase tracking-wider rounded-sm mb-1.5 font-sans">
            {book.genre || 'General'}
          </span>
          <h2 className="font-serif text-base font-black text-[#3E3024] line-clamp-1 tracking-tight">
            {book.title}
          </h2>
          <p className="font-sans text-xs text-[#3E3024]/50 italic font-medium truncate">
            by {book.author || 'Unknown Author'}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#3E3024]/5 mt-2">
          {book.rating ? (
            <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-[#C89B3C]">
              <span>★</span>
              <span>{book.rating}</span>
            </div>
          ) : (
            <span className="text-[10px] font-sans text-[#3E3024]/30 font-bold uppercase">Unrated</span>
          )}

          <Link
            to={`/book/${book.id}`}
            className="font-sans text-[10px] font-bold text-[#556B2F] hover:text-[#435524] uppercase tracking-wider transition-colors"
          >
            Inspect →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;