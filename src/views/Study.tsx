import { useGetStudyByIdQuery } from "@/api/documents/documentApi";
import DocumentSkeleton from "@/components/shared/loaders/document-skeleton";
import { renderProseMirrorContent } from "@/lib/renderProseMirror";

import { useEffect } from "react";
import { useLocation, useParams } from "react-router";

export const Study: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const loading = true;

  // Parse description
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let parsedDescription: any = null;

  const { data: fetchedStudy, isLoading: fetchedStudyIsLoading } = useGetStudyByIdQuery(id, {
    refetchOnMountOrArgChange: false, // Prevents automatic refetching
  });

  console.log("fetched study?", fetchedStudy);

  if (fetchedStudy?.description) {
    try {
      parsedDescription = JSON.parse(fetchedStudy?.description);
      console.log("Parsed description:", parsedDescription);
    } catch (error) {
      console.error("Failed to parse description:", error);
    }
  }

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <>
      {loading ? (
        <DocumentSkeleton />
      ) : (
        <div className="flex h-full w-full flex-col p-12 max-sm:px-4">
          <div className="mx-auto flex h-full w-3/4 flex-col px-12 py-4 max-sm:px-4">
            <h1 className="mb-2 text-xl font-black text-black">{fetchedStudy?.title || "Study"}</h1>
            <span className="font-black text-black">Study ID: {id}</span>
            <div>
              <span className="font-black text-black">Type:</span> Study
            </div>
            <br />
            <div className="text-black">
              {parsedDescription
                ? renderProseMirrorContent(parsedDescription)
                : "No description available."}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Study;
