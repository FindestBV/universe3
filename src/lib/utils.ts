/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function encodeToken(token:string):string{
  return btoa(token);
}

export function decodeToken(token:string):string{
  return atob(token);
}

interface TextContent {
  type: 'text';
  text: string;
}

interface ParagraphBlock {
  type: 'paragraph';
  content: TextContent[];
}

interface DocDescription {
  type: 'doc';
  content: ParagraphBlock[];
}

export const extractTextContent = (description: any): string => {
  let textContent = '';

  if (description?.type === 'doc' && Array.isArray(description.content)) {
      description.content.forEach((block: any) => {
          if (block.type === 'paragraph' && Array.isArray(block.content)) {
              block.content.forEach((contentItem: any) => {
                  if (contentItem.type === 'text') {
                      textContent += contentItem.text + ' ';
                  }
              });
          }
      });
  }

  return textContent.trim();
};
