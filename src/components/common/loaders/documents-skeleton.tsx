/**
 * DocumentsSkeleton component displays a placeholder skeleton UI while the actual document content is loading.
 *
 * @component
 * @example
 * return <DocumentsSkeleton />;
 *
 * @param {DocumentSkeletonProps} props - The properties for the DocumentsSkeleton component.
 * @returns {JSX.Element} A skeleton placeholder for a document.
 */
import { Skeleton } from "@/components/ui/skeleton";

export const DocumentsSkeleton = () => {
  return (
    <>
      {/* Document Cards Skeleton */}
      <div className="space-y-4">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="flex animate-pulse items-center space-x-4 rounded-lg bg-gray-100 p-4"
          >
            <Skeleton className="h-6 w-6 animate-pulse bg-gray-100" /> {/* Checkbox */}
            <div className="flex-grow space-y-2">
              <Skeleton className="h-6 w-3/4 animate-pulse bg-gray-100" /> {/* Document Title */}
              <Skeleton className="h-4 w-1/2 animate-pulse bg-gray-100" /> {/* Document Details */}
            </div>
            <Skeleton className="h-10 w-20 animate-pulse bg-gray-100" /> {/* Action Button */}
          </div>
        ))}
      </div>
    </>
  );
};

export default DocumentsSkeleton;
