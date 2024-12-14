import { Skeleton } from "@/components/ui/skeleton";

export const DocumentsSkeleton: React.FC = () => {
  return (
    
    <>
      {/* Document Cards Skeleton */}
      <div className="space-y-4">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="rounded-lg p-4 flex items-center space-x-4 bg-gray-100 animate-pulse">
            <Skeleton className="h-6 w-6 bg-gray-100 animate-pulse" /> {/* Checkbox */}
            <div className="flex-grow space-y-2">
              <Skeleton className="h-6 w-3/4 bg-gray-100 animate-pulse" /> {/* Document Title */}
              <Skeleton className="h-4 w-1/2 bg-gray-100 animate-pulse" /> {/* Document Details */}
            </div>
            <Skeleton className="h-10 w-20 bg-gray-100 animate-pulse" /> {/* Action Button */}
          </div>
        ))}
      </div>
      </>
    
  );
};

export default DocumentsSkeleton;