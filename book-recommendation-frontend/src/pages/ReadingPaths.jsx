/**
 * ReadingPaths.jsx — Curated Learning Journeys
 * Aesthetic: A linear shelf of books meant to be read in order.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ReadingPaths = () => {
  const { id } = useParams();
  const [steps, setSteps] = useState([]);
  const [pathInfo, setPathInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPath = async () => {
      try {
        setIsLoading(true);
        // Fetch path details (we'll fetch all paths and filter or specific)
        // For now, assume id corresponds to the path_id
        const res = await fetch(`http://localhost:5000/api/librarian/paths/${id}`);
        const data = await res.json();
        if (data.success) setSteps(data.steps);
      } catch (err) {
        console.error("Failed to load journey:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPath();
  }, [id]);

  return (
    <div className="bg-[#F8F3EA] min-h-screen text-[#3E3024] font-sans pt-24 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="text-xs font-bold uppercase tracking-widest text-[#B66A50] hover:underline mb-8 block">
          ← Return to Sanctuary
        </Link>
        
        <h1 className="font-serif text-5xl font-black mb-4">Curated Learning Journey</h1>
        <p className="font-sans text-sm text-[#3E3024]/60 mb-12 italic">
          A step-by-step masterclass curated by your AI Librarian.
        </p>

        {isLoading ? (
          <div className="animate-pulse text-[#3E3024]/40">Unfolding the journey...</div>
        ) : (
          <div className="space-y-8">
            {steps.map((step, idx) => (
              <div key={step.id} className="relative pl-10 border-l border-[#556B2F]/20">
                <div className="absolute -left-3 top-0 w-6 h-6 bg-[#556B2F] text-[#FFFDF8] rounded-full flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <div className="bg-[#FFFDF8] border border-[#3E3024]/10 p-6 rounded-xl shadow-xs">
                  <h3 className="font-serif text-xl font-bold text-[#3E3024]">{step.title}</h3>
                  <p className="font-sans text-xs font-bold text-[#B66A50] uppercase tracking-wider mt-1 mb-3">by {step.author}</p>
                  <p className="font-sans text-sm text-[#3E3024]/70 italic border-t border-[#3E3024]/5 pt-4">
                    <span className="font-bold text-[#556B2F]">Librarian's Note:</span> {step.step_rationale}
                  </p>
                  <Link to={`/book/${step.book_id}`} className="inline-block mt-4 text-xs font-bold uppercase tracking-wider text-[#556B2F] hover:underline">
                    View Volume →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingPaths;