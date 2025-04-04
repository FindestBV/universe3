import { setLockPage } from "@/api/documents/documentSlice";
import ShareObject from "@/components/common/dialogs/share-object";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RootState } from "@/store";
import { EllipsisVertical, Info, Lock, LockOpen, Pin, Star, Trash } from "lucide-react";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { TableOfContents } from "./TableOfContents";

export const ReferencesSidebar: React.FC<{
  editor?: string;
  parentId?: number;
}> = ({ editor, parentId }) => {
  // const scrollToSection = (sectionId: string) => {
  //   const tabSectionPattern = /^#?([^#]+)#(.+)$/;

  //   const match = sectionId.match(tabSectionPattern);

  //   if (match) {
  //     const [, tabId, elementId] = match;

  //     // Dispatch global event
  //     window.dispatchEvent(
  //       new CustomEvent("scrollToTabSection", {
  //         detail: {
  //           tabId,
  //           sectionId: elementId,
  //         },
  //       }),
  //     );
  //   } else {
  //     // Normal scrolling if no tab specified
  //     const sectionElement = document.querySelector(sectionId);
  //     if (sectionElement) {
  //       sectionElement.scrollIntoView({ behavior: "smooth" });
  //     } else {
  //       console.error("Section not found:", sectionId);
  //     }
  //   }
  // };

  const [rating, setRating] = useState(2);
  const isLocked = useSelector((state: RootState) => state.document.isLocked);
  const dispatch = useDispatch();

  const lockPage = (parentId: number) => {
    console.log(`clicked to lock ${parentId}`, isLocked);
    dispatch(setLockPage({ isLocked: !isLocked, documentId: parentId }));
  };

  console.log("lock page", isLocked);

  return (
    <div className="fixed top-4 flex h-full flex-col p-4">
      <div className="mb-8 flex gap-2">
        <Button className={`rounded-sm border border-blue-500 bg-blue-100 px-2 py-1`}>
          <Pin className="fill-blue-600" />
        </Button>

        <ShareObject parentId={parentId} />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={`rounded-sm border border-slate-200 bg-slate-100 px-3 hover:bg-black hover:text-white`}
              >
                <EllipsisVertical />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="w-72 bg-white" align="end">
              <div className="m-2 flex flex-col gap-3 rounded-md bg-white text-black">
                <div className="flex items-center gap-2 font-bold">
                  <Info size={10} /> Page info
                </div>
                <Separator />
                <div className="flex items-center gap-1">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex w-full flex-col justify-between">
                    <small className="text-xs">Created by sander.vanderwoude@findest.eu</small>
                    <small className="text-xs text-gray-500">26 June 2024</small>
                  </div>
                </div>
                <div className="group flex items-center gap-1">
                  {!isLocked ? (
                    <div
                      className="flex w-full cursor-pointer items-center justify-start gap-4 rounded-sm py-2 group-hover:bg-black group-hover:text-white"
                      onClick={() => lockPage(parentId)}
                    >
                      <Lock className="ml-2 group-hover:text-white" size={16} />
                      <small className="text-xs group-hover:text-white">Lock page</small>
                    </div>
                  ) : (
                    <div
                      className="flex w-full cursor-pointer items-center justify-start gap-4 rounded-sm bg-black py-2 text-white"
                      onClick={() => lockPage(parentId)}
                    >
                      <LockOpen className="ml-2 group-hover:text-white" size={16} />
                      <small className="text-xs group-hover:text-white">Unlock page</small>
                    </div>
                  )}
                </div>
                <div className="group flex items-center gap-1">
                  <div className="flex w-full cursor-pointer items-center justify-start gap-4 rounded-sm py-2 group-hover:bg-red-500 group-hover:text-white">
                    <Trash className="ml-2 stroke-red-500 group-hover:stroke-white" size={16} />
                    <small className="text-xs text-red-500 group-hover:text-white">
                      Delete page
                    </small>
                  </div>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="mb-8 flex flex-col gap-2">
        <div className="innerCardContainer flex gap-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((starValue) => (
              <button
                key={starValue}
                onClick={() => setRating(2)}
                className="text-black transition-colors hover:text-yellow-500"
              >
                <Star
                  className="h-4 w-4"
                  fill={rating >= starValue ? "black" : "none"}
                  stroke={rating >= starValue ? "black" : "currentColor"}
                />
              </button>
            ))}
          </div>

          <div className="innerCardContent">
            <p className="text-sm">Technology</p>
          </div>
        </div>
        <div className="innerCardContainer flex gap-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((starValue) => (
              <button
                key={starValue}
                onClick={() => setRating(2)}
                className="text-black transition-colors hover:text-yellow-500"
              >
                <Star
                  className="h-4 w-4"
                  fill={rating >= starValue ? "black" : "none"}
                  stroke={rating >= starValue ? "black" : "currentColor"}
                />
              </button>
            ))}
          </div>

          <div className="innerCardContent">
            <p className="text-sm">Technology 2</p>
          </div>
        </div>
      </div>

      <h3 className="my-4 text-sm font-bold">On this page</h3>

      {/* Sticky TOC with scrolling */}

      <div className="max-h-[75vh] max-w-[330px] flex-grow overflow-y-auto">
        <TableOfContents editor={editor} />
      </div>

      {/* <div className="mt-auto border-t border-neutral-200">
        <ul className="flex flex-col gap-3 py-4">
          <li className="flex items-center gap-2 text-sm">
            <Link2Icon size={20} />
            <a
              className="cursor-pointer hover:text-slate-400"
              onClick={() => scrollToSection("#linkedDocuments")}
            >
              Linked documents
            </a>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <FileQuestion size={20} />
            <a
              className="cursor-pointer hover:text-slate-400"
              onClick={() => scrollToSection("#linkedDocuments#connectedQueries")}
            >
              Connected queries
            </a>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <File size={20} />
            <a
              className="cursor-pointer hover:text-slate-400"
              onClick={() => scrollToSection("#linkedDocuments#connectedPages")}
            >
              Connected pages
            </a>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <MessageCircle size={20} />
            <a
              className="cursor-pointer hover:text-slate-400"
              onClick={() => scrollToSection("#linkedDocuments#connectedComments")}
            >
              Page comments
            </a>
          </li>
        </ul>
      </div> */}
    </div>
  );
};

export default ReferencesSidebar;
