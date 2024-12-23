import {
  useGetDocumentByIdQuery,
  useGetDocumentRelatedScienceArticlesQuery,
} from "@/api/documents/documentApi";
import { Toolbar } from "@/components/shared/layout/toolbar";
import DocumentSkeleton from "@/components/shared/loaders/document-skeleton";
// import { FindestButton } from "@/components/shared/utilities/findest-button";
import UserAvatar from "@/components/shared/utilities/user-avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";

import { useEffect, useState } from "react";
import { useParams } from "react-router";

export const Document: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(false); // State for toolbar visibility
  const { data: fetchedDocument } = useGetDocumentByIdQuery(id!, {
    refetchOnMountOrArgChange: false,
  });
  const { data: scienceArticles } = useGetDocumentRelatedScienceArticlesQuery(id!);

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
    if (fetchedDocument) {
      console.log(fetchedDocument);
    }
    window.scroll(0, 0);
  }, [fetchedDocument]);

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

            <h4 className="pb-2 font-black">Connected Objects:</h4>
            <div className="mt-2 flex gap-4">{renderConnectedObjects}</div>
            <br />

            {/* Tabs Section */}
            <Tabs defaultValue="documentInfo" className="mt-6">
              <TabsList className="mb-4 rounded-none border-b bg-transparent">
                <TabsTrigger value="documentInfo">Document Information</TabsTrigger>
                <TabsTrigger value="similarDocuments">Similar Documents</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
              </TabsList>
              <TabsContent value="documentInfo">
                <h4 className="pb-2 font-black">Document Information</h4>
                <div className="flex flex-row gap-4">
                  <div className="w-3/4">
                    <div>{fetchedDocument?.abstract || "No document information available."}</div>
                  </div>
                  <div className="w-1/4">
                    <div className="rounded-sm border p-4">
                      <h5 className="mb-2 font-bold">Meta</h5>
                      {fetchedDocument?.searchInformation ? (
                        <div>
                          {Object.entries(fetchedDocument.searchInformation).map(([key, value]) => {
                            // Display specific keys in a user-friendly format
                            if (key === "journalName") {
                              return (
                                <div key={key} className="mb-2">
                                  <strong>Journal:</strong>
                                  <br />
                                  {value || "Not available"}
                                </div>
                              );
                            }
                            if (key === "publicationDate") {
                              return (
                                <div key={key} className="mb-2">
                                  <strong>Publication Date:</strong>
                                  <br />
                                  {value || "Not available"}
                                </div>
                              );
                            }
                            return null; // Skip keys that are not relevant
                          })}
                        </div>
                      ) : (
                        <p>No metadata available.</p>
                      )}

                      <div className="mb-2">
                        <strong>Authors:</strong>
                        {Object.entries(fetchedDocument?.authorships).map((key) => {
                          return <p>{key[1]?.authorName || "Not available"}</p>;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="similarDocuments">
                <h4 className="pb-2 font-black">Similar Documents</h4>
                <div className="mt-2 flex gap-4">
                  <ul>
                    {scienceArticles?.map((article, index) => (
                      <li key={index} className="science-article">
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                          {article.title || "Untitled Article"}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="attachments">
                <h4 className="pb-2 font-black">Attachments</h4>
                <p>No attachments available.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
};

export default Document;
