/**
 * VotingCard Component
 *
 * This component displays a rating system using stars and a corresponding page title.
 * It is designed for use in a rating list where users can visually assess the ranking
 * of different items.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.star - The rating value (number of stars, from 1 to 5).
 * @param {string} props.title - The title of the rated item.
 * @param {Function} [props.onShow] - Optional function called when the "Show" button is clicked.
 *
 * @example
 * <VotingCard star={4} title="Polyethylene-based Paper" onShow={() => console.log("Show clicked")} />
 *
 * @returns {JSX.Element} The rendered VotingCard component.
 */
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
    <div className="votingCard">
      <div className="innerCardContainer">
        <div className="innerCardContent">
          <div className="innerCardList">
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
        <button onClick={() => setShowDetails((prev) => !prev)} className="innerCardToggleTrigger">
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
          className="innerCardTogglePanel"
        >
          <p className="text-sm">
            This is some additional detail text. It provides more information about the item.
          </p>
        </motion.div>
      )}
    </div>
  );
}
