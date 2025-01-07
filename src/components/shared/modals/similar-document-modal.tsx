import {
  useGetDocumentByIdQuery,
  useGetEntityConnectedDocsQuery,
} from "@/api/documents/documentApi";
import LinkedCounts from "@/components/shared/cards/linked-counts";
import UserAvatar from "@/components/shared/utilities/user-avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Trash2, Upload } from "lucide-react";

import { useEffect, useState } from "react";

import { AddLinkToItem } from "./add-link-to-item";

type SimilarDocumentModalProps = {
  title: string;
  id: string;
  mainContents?: any;
  searchInformation?: any;
  type: "entity" | "study" | "document" | "linkedObjects"; // Added "linkedObjects"
};

export const SimilarDocumentModal: React.FC<SimilarDocumentModalProps> = ({
  title,
  id,
  mainContents,
  searchInformation,
  type,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const linkItemToOther = (id: string) => {
    console.log(`item with ${id} linked`);
  };

  // Fetch main document data
  const {
    data: fetchedDocument,
    refetch: refetchDocument,
    isLoading: isLoadingDocument,
  } = useGetDocumentByIdQuery(id, {
    skip: !isOpen,
    refetchOnMountOrArgChange: true,
  });

  // Fetch connected documents data
  const {
    data: connectedDocuments,
    refetch: refetchConnectedDocuments,
    isLoading: isLoadingConnected,
  } = useGetEntityConnectedDocsQuery(id, {
    skip: !isOpen,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isOpen) {
      console.log("Modal opened. Fetching document and connected queries...");
      refetchDocument();
      refetchConnectedDocuments();
    }
  }, [isOpen, refetchDocument, refetchConnectedDocuments]);

  // If type is "linkedObjects," render as a GenericCard
  if (type === "linkedObjects") {
    return (
      <>
        <div className="itemCard">
          <div className={`innerCardMain items-start gap-4`}>
            <Checkbox id={`card-${id}`} className="secondary mr-4 mt-1" />
            <div className={`flex flex-row items-start gap-8`}>
              {<div className="iconText mt-1">SCIENCE</div>}
              <SimilarDocumentModal
                title={title}
                id={id}
                mainContents={mainContents}
                searchInformation={searchInformation}
                type="document"
              />
            </div>
            <div className="relative flex h-auto w-[25px]">{/* Hoverable Actions */}</div>
          </div>
          <div className="links">
            <AddLinkToItem attachToItem={linkItemToOther} parentId={id} parentTitle={title} />
            <a href="#" className="trashCan">
              <Trash2 size={14} />
            </a>
          </div>
        </div>
      </>
    );
  }

  // Default rendering for other types
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {type === "entity" ? (
          <Button variant="outline" className="flex items-center gap-2 border-0 bg-blue-200">
            <span>{title}</span>
          </Button>
        ) : type === "study" ? (
          <Button variant="ghost" className="flex items-center gap-2">
            <span>Open Study Details</span>
          </Button>
        ) : (
          <h4 className="cursor-pointer font-bold" aria-label="similar-title">
            {title}
          </h4>
        )}
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

            {/* <h6 className="text-lg font-bold">Connections:</h6>
            <div className="mt-2 flex flex-wrap gap-4">
              {isLoadingConnected ? (
                <p>Loading connections...</p>
              ) : connectedDocuments && connectedDocuments?.length > 0 ? (
                connectedDocuments.map((doc: any) => (
                  <div key={doc.id} className="connected-object Entity">
                    <a
                      href={`/library/entities/${doc.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {doc.title || "Unnamed Document"}
                    </a>
                  </div>
                ))
              ) : (
                <p>No connected documents found.</p>
              )}
            </div> */}

            <Tabs defaultValue="documentInfo" className="mt-6">
              <TabsList className="mb-4 w-full justify-start rounded-none border-b border-[#f1f1f1] bg-transparent">
                <TabsTrigger value="documentInfo">Document Information</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
              </TabsList>
              <TabsContent value="documentInfo">
                {isLoadingDocument ? (
                  <p>Loading document...</p>
                ) : (
                  <>
                    <LinkedCounts
                      id={id}
                      linkedCounts={fetchedDocument?.linkedCounts || {}}
                      onItemClick={(id) => console.log(`Item clicked: ${id}`)}
                      connectedObjects={fetchedDocument?.connectedObjects || []}
                    />
                    <h4 className="pb-2 font-black">Document Abstract</h4>
                    <div className="flex flex-row gap-4">
                      <div className="w-3/4">
                        <p>
                          {(mainContents && mainContents[0]?.content) ||
                            fetchedDocument?.abstract ||
                            "N/A"}
                        </p>
                      </div>
                      <div className="w-1/4">
                        <div className="rounded-sm border border-[#f1f1f1] p-4">
                          {searchInformation ? (
                            <div>
                              {Object.entries(searchInformation).map(([key, value]) => {
                                if (key === "journalName") {
                                  return (
                                    <div key={key} className="mb-2">
                                      <strong>Journal:</strong>
                                      <br />
                                      {value || "N/A"}
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
                  </>
                )}
              </TabsContent>

              <TabsContent value="attachments">
                <h4 className="pb-2 font-black">Attachments</h4>
                <div className="flex items-center gap-2 rounded-sm bg-slate-100 p-4">
                  <Upload size={14} />
                  <p>List of attachments (should not be editable)</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimilarDocumentModal;
