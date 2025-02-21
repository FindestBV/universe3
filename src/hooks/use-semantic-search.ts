import { SearchResult } from "@/types/types";
import ky from "ky";
import { kmeans } from "ml-kmeans";
import { ZodIssue } from "zod";

import { useCallback, useEffect, useMemo, useState } from "react";

function groupResults(
  results: SearchResult[] | undefined,
  numClusters: number = 3,
): SearchResultGroup[] | undefined {
  if (!results || !Array.isArray(results) || results.length === 0) {
    console.warn("groupResults: No valid search results provided.");
    return undefined;
  }

  // Ensure all results have `cosine_similarity`
  if (!results.every((res) => typeof res.cosine_similarity === "number")) {
    console.error("groupResults: Missing cosine_similarity in some results", results);
    return undefined;
  }

  if (results.length < numClusters) {
    numClusters = results.length;
  }

  const data = results.map((result) => [result.cosine_similarity]);
  const kmeansResult = kmeans(data, numClusters, {});

  // Sort cluster indices
  const sortedClusterIndices = kmeansResult.centroids
    .map((_, index) => index)
    .sort((a, b) => kmeansResult.centroids[b][0] - kmeansResult.centroids[a][0]);

  const groupedResults: SearchResultGroup[] = Array(numClusters)
    .fill(null)
    .map((_, i) => ({
      name: `Group ${i + 1}`,
      results: [],
      similarity: { from: -Infinity, to: Infinity },
    }));

  // Map clusters
  const clusterMapping = sortedClusterIndices.reduce((acc, clusterIndex, sortedIndex) => {
    acc[clusterIndex] = sortedIndex;
    return acc;
  }, {});

  kmeansResult.clusters.forEach((clusterIndex, resultIndex) => {
    const groupIndex = clusterMapping[clusterIndex];
    const group = groupedResults[groupIndex];
    const similarity = results[resultIndex].cosine_similarity;

    group.results.push(results[resultIndex]);

    group.similarity.from = Math.max(group.similarity.from, similarity);
    group.similarity.to = Math.min(group.similarity.to, similarity);
  });

  return groupedResults;
}

export const useSemanticSearch = (
  term: string | undefined,
): {
  error: string | undefined;
  validationErrors: ZodIssue[] | undefined;
  isSearching: boolean;
  performSearch: (term: string) => Promise<void>;
  reset: () => void;
  results: SearchResult[] | undefined;
  groups: SearchResult[] | undefined;
} => {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [validationErrors, setValidationErrors] = useState<ZodIssue[] | undefined>();
  const [results, setResults] = useState<SearchResult[] | undefined>();
  const groups = useMemo(() => groupResults(results), [results]);

  async function performSearch(term: string) {
    try {
      setIsSearching(true);
      setResults(undefined);
      setError(undefined);
      setValidationErrors(undefined);

      const response = (await ky
        .post(
          "https://api-test.findest.com/api/linking/08dd502d-0ee9-4b43-8a16-ea15b5812da6/haslinkedtypes?objectType[]=3&objectType[]=6",
          {
            json: { content: term },
          },
        )
        .json()) as SearchResult[];

      setResults(response);
    } catch (error: any) {
      console.log(error.response);
      if (error.name === "HTTPError" && error.response.status === 422) {
        try {
          const errorJson = (await error.response.json()) as ZodIssue[];

          setValidationErrors(errorJson);
        } catch (error) {
          console.log(error);
        }
      }

      setError(error?.message);
    } finally {
      setIsSearching(false);
    }
  }

  useEffect(() => {
    if (term) {
      performSearch(term);
    }
  }, [term]);

  const handleReset = useCallback(() => {
    setIsSearching(false);
    setResults(undefined);
  }, []);

  return {
    results,
    groups,
    error,
    validationErrors,
    performSearch,
    reset: handleReset,
    isSearching,
  };
};
