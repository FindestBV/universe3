import { Checkbox } from "@/components/ui/checkbox";
import { Loader } from "lucide-react";

interface ProjectResult {
  id: string;
  name: string;
  type: string;
  url: string;
  description?: string;
}

interface ProjectSearchResultsProps {
  results: ProjectResult[];
  isLoading: boolean;
}

export const ProjectSearchResults = ({ results, isLoading }: ProjectSearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">No results found</div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
      {results.map((result) => (
        <div
          key={result.id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <Checkbox id={`card-${result.id}`} />
          <div className="text-sm text-gray-500">{result.type}</div>
          <h3 className="mb-2 text-lg font-semibold">
            <a
              href={result.url}
              className="text-black hover:text-blue-800 hover:underline"
              target={result.url.startsWith("http") ? "_blank" : "_self"}
              rel={result.url.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {result.name}
            </a>
          </h3>
          {result.description && (
            <p className="line-clamp-2 text-sm text-gray-600">{result.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectSearchResults;
