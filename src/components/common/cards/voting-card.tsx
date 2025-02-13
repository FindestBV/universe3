"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useState } from "react";

export default function VotingCard() {
  const [rating, setRating] = useState(0);
  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex gap-8">
          <div className="flex items-start gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-black transition-colors hover:text-primary-foreground ${rating >= star ? "fill-primary" : "stroke-muted-foreground"} `}
              >
                <StarIcon className="h-6 w-6" />
              </button>
            ))}
          </div>
          <h2 className="font-semibold">Title</h2>
        </div>
        <p className="iconText">Show</p>
      </CardContent>
    </Card>
  );
}

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
