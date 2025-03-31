import { Button } from "@/components/ui/button";
import {
  EllipsisVertical,
  File,
  Forward,
  Link2Icon,
  MessageCircle,
  Pin,
  Share,
  Star,
} from "lucide-react";

import React, { useState } from "react";

import { TableOfContents } from "./TableOfContents";

export const ReferencesSidebar: React.FC<{
  editor?: string;
}> = ({ editor }) => {
  const scrollToSection = (sectionId: string) => {
    const tabSectionPattern = /^#?([^#]+)#(.+)$/;

    const match = sectionId.match(tabSectionPattern);

    if (match) {
      const [, tabId, elementId] = match;

      // Dispatch global event
      window.dispatchEvent(
        new CustomEvent("scrollToTabSection", {
          detail: {
            tabId,
            sectionId: elementId,
          },
        }),
      );
    } else {
      // Normal scrolling if no tab specified
      const sectionElement = document.querySelector(sectionId);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: "smooth" });
      } else {
        console.error("Section not found:", sectionId);
      }
    }
  };

  const [rating, setRating] = useState(2);

  return (
    <div className="fixed top-4 flex h-full flex-col p-4">
      <div className="mb-8 flex gap-2">
        <Button className={`rounded-sm border border-blue-500 bg-blue-100 px-3`}>
          <Pin className="fill-blue-600" />
        </Button>

        <button className="flex items-center gap-2 rounded border border-slate-300 bg-slate-100 px-2 text-sm text-black transition-colors duration-200 hover:bg-slate-200">
          <Forward /> Share
        </button>
        <Button className={`rounded-sm border border-slate-200 bg-slate-100 px-3`}>
          <EllipsisVertical />
        </Button>
      </div>

      <div className="mb-8 flex flex-col gap-2">
        <div className="innerCardContainer flex gap-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((starValue) => (
              <button
                key={starValue}
                onClick={() => setRating(2)}
                className="text-black transition-colors hover:text-yellow-500"
              >
                <Star
                  className="h-4 w-4"
                  fill={rating >= starValue ? "black" : "none"}
                  stroke={rating >= starValue ? "black" : "currentColor"}
                />
              </button>
            ))}
          </div>

          <div className="innerCardContent">
            <p className="text-sm">Technology</p>
          </div>
        </div>
        <div className="innerCardContainer flex gap-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((starValue) => (
              <button
                key={starValue}
                onClick={() => setRating(2)}
                className="text-black transition-colors hover:text-yellow-500"
              >
                <Star
                  className="h-4 w-4"
                  fill={rating >= starValue ? "black" : "none"}
                  stroke={rating >= starValue ? "black" : "currentColor"}
                />
              </button>
            ))}
          </div>

          <div className="innerCardContent">
            <p className="text-sm">Technology 2</p>
          </div>
        </div>
      </div>

      <h3 className="my-4 text-sm font-bold">On this page</h3>

      {/* Sticky TOC with scrolling */}

      <div className="max-h-[75vh] max-w-[330px] flex-grow overflow-y-auto">
        <TableOfContents editor={editor} />
      </div>

      <div className="mt-auto border-t border-neutral-200">
        <ul className="flex flex-col gap-3 py-4">
          <li className="flex items-center gap-2 text-sm">
            <Link2Icon size={20} />
            <a
              className="cursor-pointer hover:text-slate-400"
              onClick={() => scrollToSection("#linkedDocuments")}
            >
              Linked documents
            </a>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <File size={20} />
            <a
              className="cursor-pointer hover:text-slate-400"
              onClick={() => scrollToSection("#linkedDocuments#connectedQueries")}
            >
              Connected queries
            </a>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <File size={20} />
            <a
              className="cursor-pointer hover:text-slate-400"
              onClick={() => scrollToSection("#linkedDocuments#connectedPages")}
            >
              Connected pages
            </a>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <MessageCircle size={20} />
            <a
              className="cursor-pointer hover:text-slate-400"
              onClick={() => scrollToSection("#linkedDocuments#connectedComments")}
            >
              Page comments
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ReferencesSidebar;
