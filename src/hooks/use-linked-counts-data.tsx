import { usePrefetchedData } from "@/api/documents/documentApi";

/**
 * Custom hook to fetch prefetched data for linked counts
 */
const useLinkedCountsData = (id, linkedCounts, objectTypeMapping) => {
  const results = {};

  for (const key of Object.keys(linkedCounts)) {
    const objectType = objectTypeMapping[key];

    // ✅ Call `usePrefetchedData` at the top level!
    results[key] = usePrefetchedData(id, objectType);
  }

  return results; // This now returns the fetched data properly.
};

export default useLinkedCountsData;
