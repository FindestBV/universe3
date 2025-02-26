import { usePrefetchedData } from "@/api/documents/documentApi";

/**
 * Custom hook to fetch prefetched data for linked counts
 */
const useLinkedCountsData = (id, linkedCounts, objectTypeMapping) => {
  // Create an object where each key calls `usePrefetchedData` at the top level
  const prefetchedData = Object.entries(linkedCounts).reduce((acc, [key]) => {
    const objectType = objectTypeMapping[key];

    // Only call `usePrefetchedData` if objectType is valid
    if (objectType !== undefined) {
      acc[key] = usePrefetchedData(id, objectType); // Hook is called at top level ✅
    }

    return acc;
  }, {});

  return prefetchedData;
};

export default useLinkedCountsData;
