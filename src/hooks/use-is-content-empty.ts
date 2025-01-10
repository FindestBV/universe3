import { isContentEmpty } from "@/lib/utils";
import { Content } from "@tiptap/core";

import { useMemo } from "react";

export function useIsContentEmpty(content: Content | undefined): boolean {
  return useMemo(() => isContentEmpty(content), [content]);
}

export default useIsContentEmpty;
