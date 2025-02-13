import { Star } from "lucide-react";

import { useState } from "react";

interface VotingCardProps {
  star: number;
}

export default function VotingCard({ star }: VotingCardProps) {
  const [rating, setRating] = useState(star);

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
        <p className="text-sm font-semibold text-gray-500">Show</p>
      </div>
    </div>
  );
}
