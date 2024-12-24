/* eslint-disable @typescript-eslint/no-explicit-any */
import { currentUser } from "@/api/auth/authSlice";
import {
  useGetDocumentRelatedScienceArticlesQuery,
  useGetEntityByIdQuery,
} from "@/api/documents/documentApi";
import LinkedCounts from "@/components/shared/cards/linked-counts";
import { Toolbar } from "@/components/shared/layout/toolbar";
import DocumentSkeleton from "@/components/shared/loaders/document-skeleton";
import SimilarDocumentModal from "@/components/shared/modals/similar-document-modal";
import { ReferencesSearchbar } from "@/components/shared/search/references-searchbar";
import UserAvatar from "@/components/shared/utilities/user-avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { renderProseMirrorContent } from "@/lib/renderProseMirror";
import {
  BookOpenCheck,
  FileText,
  Fingerprint,
  Highlighter,
  Inbox,
  Paperclip,
  Upload,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

export const Entity: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const location = useLocation();
  // const entity = location.state;
  const user = useSelector(currentUser);
  console.log("Entity user:", user);
  const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(true); // State for toolbar visibility

  let parsedDescription: any = null;

  const { data: fetchedEntity, isLoading: fetchedEntityIsLoading } = useGetEntityByIdQuery(id, {
    refetchOnMountOrArgChange: false, // Prevents automatic refetching
  });

  const { data: scienceArticles } = useGetDocumentRelatedScienceArticlesQuery(id!);
  console.log(scienceArticles);

  if (fetchedEntity?.description) {
    try {
      parsedDescription = JSON.parse(fetchedEntity.description);
      console.log("Parsed description:", parsedDescription);
    } catch (error) {
      console.error("Failed to parse description:", error);
    }
  }

  const handleEditClick = () => {
    setIsToolbarVisible((prev) => !prev); // Toggle toolbar visibility
  };

  useEffect(() => {
    if (fetchedEntity) {
      console.log(fetchedEntity);
    }
    window.scroll(0, 0);
  }, [fetchedEntity]);

  return (
    <>
      {fetchedEntityIsLoading ? (
        <DocumentSkeleton />
      ) : (
        <>
          <div className="flex h-screen w-auto flex-col">
            {isToolbarVisible === true && (
              <header className="documentCrud">
                <Toolbar />
              </header>
            )}
            <div className="flex h-full w-full max-sm:px-4">
              <div className="flex-2 flex w-3/4 flex-col px-12 py-4">
                <div className="flex">
                  <h1 className="my-4 flex-1 text-3xl font-black text-black">
                    {fetchedEntity?.title || "Document"}
                  </h1>
                </div>

                <h3 className="pb-2 text-lg font-black">Description</h3>
                <div className="flex flex-row gap-4">
                  <div className="">
                    <div>
                      {fetchedEntity?.abstract ||
                        "Inspect Weld is a technology that leverages advanced techniques such as phased array ultrasonic testing (PAUT) and machine learning to enhance the inspection of welds for defects [Ref] [Ref]. PAUT is particularly effective for inspecting complex geometries and non-magnetic materials, providing intuitive and efficient analysis of weld quality [Ref] [Ref]. Machine learning classifiers, including Decision Trees and Support Vector Machines, are employed to classify weld defects based on statistical image features, improving the accuracy and speed of defect detection [Ref]. This integration of ultrasonic testing and machine learning allows for automated, reliable inspection processes, reducing reliance on manual inspection and enhancing overall weld quality assurance [Ref] [Ref] [Ref]."}
                    </div>
                    <h3 className="my-4 flex-1 text-3xl font-black text-black">Comments</h3>
                    <p className="rounded-sm border border-[#f1f1f1] p-4">This is a comment</p>
                  </div>
                </div>
              </div>
              <div className="flex h-screen w-1/4 flex-col border-l border-[#f1f1f1] px-4 py-2">
                <h3 className="mb-2 mt-2 text-xl font-bold">References</h3>
                <ReferencesSearchbar />
                <br />
                <Tabs defaultValue="documentInfo" className="mt-6">
                  <TabsList className="mb-4 w-full justify-start rounded-none border-b border-[#f1f1f1] bg-transparent">
                    <TabsTrigger value="inbox">
                      <Inbox size={16} />
                    </TabsTrigger>
                    <TabsTrigger value="highlights">
                      <Highlighter size={16} />
                    </TabsTrigger>
                    <TabsTrigger value="attachments">
                      <Paperclip size={16} />
                    </TabsTrigger>
                    <TabsTrigger value="documents">
                      <FileText size={16} />
                    </TabsTrigger>
                    <TabsTrigger value="entities">
                      <Fingerprint size={16} />
                    </TabsTrigger>
                    <TabsTrigger value="studies">
                      <BookOpenCheck size={16} />
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="inbox">
                    <div className="flex flex-row gap-4">
                      <h1>Inbox</h1>
                    </div>
                  </TabsContent>
                  <TabsContent value="highlights">
                    <div className="flex flex-row gap-4">
                      <h1>Highlights</h1>
                    </div>
                  </TabsContent>
                  <TabsContent value="attachments">
                    <h1>Attachments</h1>
                  </TabsContent>
                  <TabsContent value="documents">
                    <h1>Documents</h1>
                  </TabsContent>
                  <TabsContent value="entities">
                    <h1>Entities</h1>
                  </TabsContent>
                  <TabsContent value="studies">
                    <h1>Studies</h1>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Entity;
