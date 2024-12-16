import DocumentSkeleton from "@/components/document-skeleton";
import { Toolbar } from "@/components/toolbar";
import { useGetDocumentByIdQuery } from "@/services/documents/documentApi";

import { useEffect, useState } from "react";
import { useParams } from "react-router";

export const Document: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false); // State for toolbar visibility
  const { data: fetchedDocument } = useGetDocumentByIdQuery(id, {
    refetchOnMountOrArgChange: false,
  });

  const renderConnectedObjects =
    fetchedDocument &&
    Object.entries(fetchedDocument?.connectedObjects).map((o, i) => {
      return (
        <div key={i}>
          <a href={o[1].url}>{o[1]?.name}</a>
        </div>
      );
    });

  useEffect(() => {
    if (fetchedDocument) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 250); // 2.5 seconds

      // Clean up the timer to prevent memory leaks
      return () => clearTimeout(timer);
    }
  }, [fetchedDocument]);

  const handleEditClick = () => {
    setIsToolbarVisible((prev) => !prev); // Toggle toolbar visibility
  };

  return (
    <>
      {isLoading ? (
        <DocumentSkeleton />
      ) : (
        <div className="flex h-screen w-auto flex-col">
          <>
            <header className="documentCrud">
              <div className="flex items-center justify-between bg-gray-100 p-4">
                <h1 className="text-lg font-bold">Document Viewer</h1>
                <button
                  onClick={handleEditClick}
                  className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Edit
                </button>
              </div>
              {isToolbarVisible && <Toolbar />} {/* Conditional rendering */}
            </header>

            <div className="flex h-full w-full flex-col p-12 max-sm:px-4">
              <h1 className="mb-2 text-xl font-black text-black">
                {fetchedDocument?.title || "Document"}
              </h1>
              <p>
                <span className="font-black text-black">Document ID:</span> {id}
              </p>
              <p>
                <span className="font-black text-black">Type: </span>{" "}
                {fetchedDocument?.type || "Document"}
              </p>
              <br />
              <p className="text-black">{fetchedDocument?.abstract}</p>
              <br />
              <h4 className="font-black">Connected Objects:</h4>
              {renderConnectedObjects}
            </div>
          </>
        </div>
      )}
    </>
  );
};

export default Document;
