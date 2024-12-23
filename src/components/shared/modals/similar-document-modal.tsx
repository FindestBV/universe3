import { useGetDocumentByIdQuery } from "@/api/documents/documentApi";
import LinkedCounts from "@/components/shared/cards/linked-counts";
import UserAvatar from "@/components/shared/utilities/user-avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Upload } from "lucide-react";

import { useEffect, useState } from "react";

export const SimilarDocumentModal: React.FC = ({
  title,
  id,
  mainContents,
  searchInformation,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: fetchedDocument,
    refetch,
    isLoading,
  } = useGetDocumentByIdQuery(id, {
    skip: !isOpen, // Skip fetching until modal is open
    refetchOnMountOrArgChange: true,
  });

  console.log("article main", mainContents);

  useEffect(() => {
    if (isOpen) {
      console.log("Modal opened. Fetching document...");

      refetch(); // Explicitly refetch when the modal opens
    }
  }, [isOpen, refetch]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <h4 className="cursor-pointer font-bold" aria-label="similar-title">
          {title}
        </h4>
      </DialogTrigger>
      <DialogContent className="h-auto max-w-6xl overflow-auto rounded-lg bg-white p-6 shadow-lg">
        {/* Static Body of Document */}
        <div className="flex flex-col">
          <div className="mx-auto flex w-full flex-col px-2 py-4 max-sm:px-4">
            <div className="mb-4 flex w-full justify-between">
              <Button className="border border-gray-300">
                <a href="#" target="_blank" className="flex items-center gap-2">
                  OPEN ARTICLE <ExternalLink size={20} />
                </a>
              </Button>
              <div className="flex items-center gap-2">
                <Button className="rounded-md bg-blue-500 px-4 py-1 text-white hover:bg-blue-600">
                  Actions
                </Button>
                <UserAvatar username="Ro" />
              </div>
            </div>

            <div className="flex">
              <h1 className="my-4 flex-1 text-3xl font-black text-black">{title || "Document"}</h1>
            </div>

            <h6 className="text-lg font-bold">Connections:</h6>
            <div className="mt-2 flex gap-4">
              {/* Replace with real connections */}
              <div className="connected-object Entity">
                <a href="/library/entities/08dd20e8-f0ed-4b51-8018-a69b5a58d448">Inspect Welding</a>
              </div>
              <Button>
                <i>+ Connect to Entity or Study</i>
              </Button>
            </div>

            <Tabs defaultValue="documentInfo" className="mt-6">
              <TabsList className="mb-4 w-full justify-start rounded-none border-b border-[#f1f1f1] bg-transparent">
                <TabsTrigger value="documentInfo">Document Information</TabsTrigger>
                <TabsTrigger value="similarDocuments">Similar Documents (5)</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
              </TabsList>
              <TabsContent value="documentInfo">
                <LinkedCounts
                  id="1"
                  linkedCounts={{}}
                  onItemClick={(id) => console.log(`Item clicked: ${id}`)}
                  connectedObjects={[]}
                />
                <h4 className="pb-2 font-black">Document Abstract</h4>
                <div className="flex flex-row gap-4">
                  <div className="w-3/4">
                    <p>{mainContents[0]?.content}</p>
                    <h1 className="my-4 text-3xl font-black">Comments</h1>
                    <p className="rounded-sm border border-[#f1f1f1] p-4">This is a comment</p>
                  </div>
                  <div className="w-1/4">
                    <div className="rounded-sm border border-[#f1f1f1] p-4">
                      {searchInformation ? (
                        <div>
                          {Object.entries(searchInformation).map(([key, value]) => {
                            // Display specific keys in a user-friendly format
                            if (key === "journalName") {
                              return (
                                <div key={key} className="mb-2">
                                  <strong>Journal:</strong>
                                  <br />
                                  {value ? value : "N/A"}
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
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="similarDocuments">
                <h4 className="pb-2 font-black">Similar Documents</h4>
                <div className="mt-2 flex gap-4">
                  <ul>
                    <li className="science-article mb-4 flex items-start gap-6 rounded-sm border border-[#f2f4f8] p-4">
                      <Button>Save</Button>
                      <div className="flex flex-col">
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <h3 className="font-black">Untitled Article</h3>
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="attachments">
                <h4 className="pb-2 font-black">Attachments</h4>
                <div className="flex items-center gap-2 rounded-sm bg-slate-100 p-4">
                  <Upload size={14} />
                  <span>Add file (PDF, docx, pptx), maximum file size 50MB.</span>
                </div>
                <Button className="primary mt-2 bg-blue-500 p-4 text-white hover:bg-slate-200">
                  Add File
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimilarDocumentModal;
