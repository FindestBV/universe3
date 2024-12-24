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
import ReferencesSidebar from "@/components/shared/sidebar/references-sidebar";
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false); // State for toolbar visibility

  const toggleSidebar = () => {
    console.log("should be toggled");
    setIsSidebarCollapsed(!isSidebarCollapsed);
    console.log(isSidebarCollapsed);
  };

  let parsedDescription: any = null;

  const { data: fetchedEntity, isLoading: fetchedEntityIsLoading } = useGetEntityByIdQuery(id, {
    refetchOnMountOrArgChange: false, // Prevents automatic refetching
  });

  if (fetchedEntity?.description) {
    try {
      parsedDescription = JSON.parse(fetchedEntity.description);
      console.log("Parsed description:", parsedDescription);
    } catch (error) {
      console.error("Failed to parse description:", error);
    }
  }

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
              <div
                className={`flex-2 flex ${isSidebarCollapsed ? "w-full" : "w-3/4"} flex-col px-12 py-4`}
              >
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
              <ReferencesSidebar onToggleSidebar={toggleSidebar} isCollapsed={isSidebarCollapsed} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Entity;
