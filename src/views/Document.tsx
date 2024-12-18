import DocumentSkeleton from "@/components/loaders/document-skeleton";
import { Toolbar } from "@/components/shared/toolbar";
import UserAvatar from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { useGetDocumentByIdQuery } from "@/services/documents/documentApi";
import { ExternalLink } from "lucide-react";

import { useEffect, useState } from "react";
import { useParams } from "react-router";

export const Document: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(false); // State for toolbar visibility
  const { data: fetchedDocument } = useGetDocumentByIdQuery(id, {
    refetchOnMountOrArgChange: false,
  });

  const renderConnectedObjects =
    fetchedDocument &&
    Object.entries(fetchedDocument?.connectedObjects).map((o, i) => (
      <div key={i} className={`connected-object ${o[1].type}`}>
        <a href={o[1].url}>{o[1]?.name}</a>
      </div>
    ));

  useEffect(() => {
    if (fetchedDocument) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 250); // Simulate loading delay

      // Cleanup the timer to prevent memory leaks
      return () => clearTimeout(timer);
    }
  }, [fetchedDocument]);

  const handleEditClick = () => {
    setIsToolbarVisible((prev) => !prev); // Toggle toolbar visibility
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <>
      {isLoading ? (
        <DocumentSkeleton />
      ) : (
        <div className="flex h-screen w-auto flex-col">
          {isToolbarVisible === true && (
            <header className="documentCrud">
              <Toolbar />
            </header>
          )}
          <div className="mx-auto flex h-full w-3/4 flex-col px-12 py-4 max-sm:px-4">
            <div className="flex w-full flex-col justify-between">
              <div className="flex w-full justify-between">
                <Button className="mb-2 border border-gray-300">
                  <a
                    href={fetchedDocument?.url}
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    OPEN ARTICLE <ExternalLink size={20} />
                  </a>
                </Button>
                <div className="flex-2 flex flex-row items-center">
                  <button
                    onClick={handleEditClick}
                    className="w-full rounded-md bg-blue-500 px-4 py-1 text-white hover:bg-blue-600"
                  >
                    Actions
                  </button>
                  <UserAvatar username={"Ro"} />
                </div>
              </div>
              <div className="flex">
                <h1 className="my-4 flex-1 text-3xl font-black text-black">
                  {fetchedDocument?.title || "Document"}
                </h1>
              </div>
            </div>
            <br />

            <h4 className="font-black">Connected Objects:</h4>
            <div className="flex gap-4">{renderConnectedObjects}</div>
            <br />
            <p className="text-black">{fetchedDocument?.abstract}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Document;
