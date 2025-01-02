/* eslint-disable @typescript-eslint/no-explicit-any */
import { currentUser } from "@/api/auth/authSlice";
import {
  useGetConnectedInboxItemsQuery,
  useGetDocumentRelatedScienceArticlesQuery,
  useGetEntityByIdQuery,
} from "@/api/documents/documentApi";
import LinkedCounts from "@/components/shared/cards/linked-counts";
import Comments from "@/components/shared/layout/comments";
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

  const { data: inboxQuery } = useGetConnectedInboxItemsQuery(id, {
    refetchOnMountOrArgChange: false, // Prevents automatic refetching
  });

  console.log("inbox query item result", inboxQuery);

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
                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-4">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="dice-d6"
                      className="svg-inline--fa fa-dice-d6 objectItem_objectIcon__xwkQs"
                      width="24px"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path
                        fill="currentColor"
                        d="M201 10.3c14.3-7.8 31.6-7.8 46 0L422.3 106c5.1 2.8 8.3 8.2 8.3 14s-3.2 11.2-8.3 14L231.7 238c-4.8 2.6-10.5 2.6-15.3 0L25.7 134c-5.1-2.8-8.3-8.2-8.3-14s3.2-11.2 8.3-14L201 10.3zM23.7 170l176 96c5.1 2.8 8.3 8.2 8.3 14l0 216c0 5.6-3 10.9-7.8 13.8s-10.9 3-15.8 .3L25 423.1C9.6 414.7 0 398.6 0 381L0 184c0-5.6 3-10.9 7.8-13.8s10.9-3 15.8-.3zm400.7 0c5-2.7 11-2.6 15.8 .3s7.8 8.1 7.8 13.8l0 197c0 17.6-9.6 33.7-25 42.1L263.7 510c-5 2.7-11 2.6-15.8-.3s-7.8-8.1-7.8-13.8l0-216c0-5.9 3.2-11.2 8.3-14l176-96z"
                      ></path>
                    </svg>{" "}
                    ENTITY
                  </div>
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
                    <Comments />
                  </div>
                </div>
              </div>
              <ReferencesSidebar
                onToggleSidebar={toggleSidebar}
                isCollapsed={isSidebarCollapsed}
                connectedDocs={inboxQuery}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Entity;
