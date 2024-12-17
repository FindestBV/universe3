import { Toolbar } from "@/components/shared/toolbar";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentSkeletonProps {
  delay?: number;
}

export const DocumentSkeleton: React.FC<DocumentSkeletonProps> = () => {
  return (
    <div className="flex h-screen w-full flex-col">
      <header className="documentCrud">
        <Toolbar />
      </header>

      <div className="flex h-full w-full flex-col p-12 max-sm:px-4">
        {/* Title Skeleton */}
        <Skeleton className="mb-2 h-8 w-3/4 animate-pulse bg-gray-100" />

        {/* Document ID Skeleton */}
        <div className="mb-2 flex items-center space-x-2">
          <Skeleton className="h-4 w-24 animate-pulse bg-gray-100" />
          <Skeleton className="h-4 w-1/4 animate-pulse bg-gray-100" />
        </div>

        {/* Type Skeleton */}
        <div className="mb-2 flex items-center space-x-2">
          <Skeleton className="h-4 w-24 animate-pulse bg-gray-100" />
          <Skeleton className="h-4 w-1/4 animate-pulse bg-gray-100" />
        </div>

        {/* Abstract Skeleton */}
        <div className="mb-4 space-y-2">
          <Skeleton className="h-4 w-full animate-pulse bg-gray-100" />
          <Skeleton className="h-4 w-5/6 animate-pulse bg-gray-100" />
          <Skeleton className="h-4 w-4/5 animate-pulse bg-gray-100" />
        </div>

        {/* Connected Objects Header */}
        <Skeleton className="mb-2 h-6 w-1/3 animate-pulse bg-gray-100" />

        {/* Connected Objects Skeletons */}
        <div className="space-y-2">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-4 w-1/2 animate-pulse bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentSkeleton;
