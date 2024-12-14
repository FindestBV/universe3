import { Skeleton } from "@/components/ui/skeleton";
import { Toolbar } from '@/components/toolbar';

interface DocumentSkeletonProps {
  delay?: number;
}

export const DocumentSkeleton: React.FC<DocumentSkeletonProps> = () => {


  return (
    <div className="flex flex-col w-full h-screen">
      <header className="documentCrud">
        <Toolbar />
      </header>

      <div className="flex flex-col w-full h-full max-sm:px-4 p-12">
        {/* Title Skeleton */}
        <Skeleton className="h-8 w-3/4 mb-2 bg-gray-100 animate-pulse" />

        {/* Document ID Skeleton */}
        <div className="flex items-center space-x-2 mb-2">
          <Skeleton className="h-4 w-24 bg-gray-100 animate-pulse" />
          <Skeleton className="h-4 w-1/4 bg-gray-100 animate-pulse" />
        </div>

        {/* Type Skeleton */}
        <div className="flex items-center space-x-2 mb-2">
          <Skeleton className="h-4 w-24 bg-gray-100 animate-pulse" />
          <Skeleton className="h-4 w-1/4 bg-gray-100 animate-pulse" />
        </div>

        {/* Abstract Skeleton */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full bg-gray-100 animate-pulse" />
          <Skeleton className="h-4 w-5/6 bg-gray-100 animate-pulse" />
          <Skeleton className="h-4 w-4/5 bg-gray-100 animate-pulse" />
        </div>

        {/* Connected Objects Header */}
        <Skeleton className="h-6 w-1/3 mb-2 bg-gray-100 animate-pulse" />

        {/* Connected Objects Skeletons */}
        <div className="space-y-2">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-4 w-1/2 bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentSkeleton;