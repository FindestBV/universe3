/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Content } from "@tiptap/core";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randomElement<T>(array: Array<T>): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function encodeToken(token: string): string {
  return btoa(token);
}

export function decodeToken(token: string): string {
  return atob(token);
}

interface TextContent {
  type: "text";
  text: string;
}

interface ParagraphBlock {
  type: "paragraph";
  content: TextContent[];
}

interface DocDescription {
  type: "doc";
  content: ParagraphBlock[];
}

export const extractTextContent = (description: any): string => {
  let textContent = "";

  if (description?.type === "doc" && Array.isArray(description.content)) {
    description.content.forEach((block: any) => {
      if (block.type === "paragraph" && Array.isArray(block.content)) {
        block.content.forEach((contentItem: any) => {
          if (contentItem.type === "text") {
            textContent += contentItem.text + " ";
          }
        });
      }
    });
  }

  return textContent.trim();
};

export const isContentEmpty = (content: Content | undefined): boolean => {
  if (!content) return true;

  if (typeof content === "string") {
    return content.trim() === "";
  }

  if (Array.isArray(content)) {
    return content.every((currentContent) => isContentEmpty(currentContent));
  }

  if (typeof content === "object" && "text" in content) {
    return isContentEmpty(content.text);
  }

  if (typeof content === "object" && "content" in content) {
    return isContentEmpty(content.content);
  }

  return true; // Default to empty if structure is unexpected
};
