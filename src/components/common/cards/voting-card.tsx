import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { useState } from "react";

interface VotingCardProps {
  star: number;
}

export default function VotingCard({ star }: VotingCardProps) {
  const [rating, setRating] = useState(star);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="w-full rounded-lg border bg-white px-4 py-2 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-8">
          <div className="flex items-start gap-1">
            {[1, 2, 3, 4, 5].map((starValue) => (
              <button
                key={starValue}
                onClick={() => setRating(starValue)}
                className="text-black transition-colors hover:text-yellow-500"
              >
                <Star
                  className="h-6 w-6"
                  fill={rating >= starValue ? "black" : "none"}
                  stroke={rating >= starValue ? "black" : "currentColor"}
                />
              </button>
            ))}
          </div>
          <h2 className="text-sm font-semibold">Tyvek paper (polyethelene based)</h2>
        </div>
        <button
          onClick={() => setShowDetails((prev) => !prev)}
          className="text-sm font-semibold text-gray-500 transition-colors hover:text-black"
        >
          {showDetails ? "Hide" : "Show"}
        </button>
      </div>

      {/* Slide-down panel */}
      {showDetails && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="mt-2 overflow-hidden rounded-lg bg-gray-100 p-4 text-sm text-gray-700"
        >
          <p className="text-sm">
            This is some additional detail text. It provides more information about the item.
          </p>
        </motion.div>
      )}
    </div>
  );
}
