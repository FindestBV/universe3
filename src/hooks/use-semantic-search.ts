import { RAGResponse, SearchState } from "@/types/ask-igor";

import { useCallback, useEffect, useState } from "react";

import { useDebounce } from "./use-debounce";

interface UseSemanticSearchOptions {
  debounceMs?: number;
  similarityThreshold?: number;
  maxResults?: number;
}

export const useSemanticSearch = (
  query: string | undefined,
  options: UseSemanticSearchOptions = {},
) => {
  const { debounceMs = 1000, similarityThreshold = 0.7, maxResults = 10 } = options;

  const [state, setState] = useState<SearchState>({
    isSearching: false,
    results: undefined,
    error: undefined,
  });

  const debouncedQuery = useDebounce(query, debounceMs);

  const performSearch = useCallback(
    async (searchQuery: string) => {
      setState((prev) => ({ ...prev, isSearching: true, error: undefined }));

      try {
        const response = await fetch("/api/rag-search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: searchQuery,
            similarityThreshold,
            maxResults,
          }),
        });

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const results: RAGResponse = await response.json();
        setState((prev) => ({
          ...prev,
          isSearching: false,
          results,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isSearching: false,
          error: error instanceof Error ? error.message : "An unknown error occurred",
        }));
      }
    },
    [similarityThreshold, maxResults],
  );

  useEffect(() => {
    if (debouncedQuery && debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setState((prev) => ({
        ...prev,
        results: undefined,
        error: undefined,
      }));
    }
  }, [debouncedQuery, performSearch]);

  const { isSearching, results, error } = state;

  return {
    isSearching,
    results,
    error,
    groups: results?.groups ?? [],
    totalResults: results?.totalResults ?? 0,
    searchMetadata: results?.searchMetadata,
  };
};
