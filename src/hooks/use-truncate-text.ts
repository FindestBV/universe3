import { useMemo } from "react";

export const useTruncateText = (text: string | undefined, maxLength: number) => {
  const truncatedText = useMemo(() => {
    if (!text) return "Untitled"; // Default fallback
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  }, [text, maxLength]);

  return truncatedText;
};

export default useTruncateText;
