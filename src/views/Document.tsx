import { useGetDocumentByIdQuery } from "@/api/documents/documentApi";
import openAccessLogo from "@/assets/openAccessLogo.png";
import { LinkedCounts } from "@/components/shared/cards/linked-counts";
import ConnectToEntity from "@/components/shared/dialogs/connect-to-entity";
import { SimilarDocumentModal } from "@/components/shared/dialogs/similar-document-modal";
import Comments from "@/components/shared/layout/comments";
import DocumentSkeleton from "@/components/shared/loaders/document-skeleton";
import UserAvatar from "@/components/shared/utilities/user-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ExternalLink,
  File,
  List,
  MoreHorizontal,
  Network,
  ScanEye,
  SquareArrowOutUpRight,
  Upload,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useParams } from "react-router";

export const Document: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const { data: fetchedDocument } = useGetDocumentByIdQuery(id!, {
    refetchOnMountOrArgChange: false,
  });

  console.log("fetched doc wth attachement (hopefully)", fetchedDocument);

  const scienceArticles = fetchedDocument?.scienceArticles;
  const attachedFiles = fetchedDocument?.attachedFiles;

  const renderConnectedObjects =
    fetchedDocument &&
    Object.entries(fetchedDocument?.connectedObjects).map((o, i) => (
      <div key={i} className={`connected-object ${o[1].type} gap-2`}>
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="dice-d6"
          className="svg-inline--fa fa-dice-d6 objectItem_objectIcon__xwkQs"
          width="12px"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill="currentColor"
            d="M201 10.3c14.3-7.8 31.6-7.8 46 0L422.3 106c5.1 2.8 8.3 8.2 8.3 14s-3.2 11.2-8.3 14L231.7 238c-4.8 2.6-10.5 2.6-15.3 0L25.7 134c-5.1-2.8-8.3-8.2-8.3-14s3.2-11.2 8.3-14L201 10.3zM23.7 170l176 96c5.1 2.8 8.3 8.2 8.3 14l0 216c0 5.6-3 10.9-7.8 13.8s-10.9 3-15.8 .3L25 423.1C9.6 414.7 0 398.6 0 381L0 184c0-5.6 3-10.9 7.8-13.8s10.9-3 15.8-.3zm400.7 0c5-2.7 11-2.6 15.8 .3s7.8 8.1 7.8 13.8l0 197c0 17.6-9.6 33.7-25 42.1L263.7 510c-5 2.7-11 2.6-15.8-.3s-7.8-8.1-7.8-13.8l0-216c0-5.9 3.2-11.2 8.3-14l176-96z"
          ></path>
        </svg>
        <a href={o[1].url}>{o[1]?.name}</a>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="rotated" className="h-8 w-8 bg-transparent p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <SquareArrowOutUpRight /> Open Page
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ScanEye /> Open Preview
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Network /> Open in Tree View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <List /> Open in List View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ));

  const openFile = (file) => {
    console.log(file.url);
    // window.location.href = file.url;
  };

  useEffect(() => {
    if (fetchedDocument) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 250); // Simulate loading delay

      // Cleanup the timer to prevent memory leaks
      return () => clearTimeout(timer);
    }
  }, [fetchedDocument]);

  // const handleEditClick = () => {
  //   setIsToolbarVisible((prev) => !prev); // Toggle toolbar visibility
  // };

  useEffect(() => {
    window.scroll(0, 0);
  }, [fetchedDocument]);

  return (
    <>
      {isLoading ? (
        <DocumentSkeleton />
      ) : (
        <div className="flex h-screen w-auto flex-col">
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
                  <button className="w-full rounded-md bg-blue-500 px-4 py-1 text-white hover:bg-blue-600">
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

            <h6 className="connections">Connections:</h6>
            <div className="mt-2 flex flex-wrap gap-4">
              {renderConnectedObjects} <ConnectToEntity />
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="documentInfo" className="mt-6">
              <TabsList className="mb-4 w-full justify-start rounded-none border-b border-[#f1f1f1] bg-transparent">
                <TabsTrigger value="documentInfo">Document Information</TabsTrigger>
                <TabsTrigger value="similarDocuments">
                  Similar Documents ({`${scienceArticles?.length ? scienceArticles.length : 0}`}){" "}
                </TabsTrigger>
                <TabsTrigger value="attachments">
                  Attachments ({`${attachedFiles?.length ? attachedFiles.length : 0}`}){" "}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="documentInfo">
                <LinkedCounts
                  id={fetchedDocument.id}
                  linkedCounts={fetchedDocument.linkedCounts}
                  onItemClick={(id) => console.log(`Item clicked: ${id}`)}
                  connectedObjects={fetchedDocument.connectedObjects}
                />
                <h4 className="pb-2 font-black">Document Abstract</h4>
                <div className="flex flex-row gap-4">
                  <div className="w-3/4">
                    <p>{fetchedDocument?.abstract || "No document information available."}</p>

                    <Comments />
                  </div>
                  <div className="w-1/4">
                    <div className="rounded-sm border border-[#f1f1f1] p-4">
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
                      <div className="mb-2">
                        <strong>Authors:</strong>
                        {Object.entries(fetchedDocument?.authorships).map((key) => {
                          return (
                            <div key={key}>
                              <p>{key[1]?.authorName || "Not available"}</p>
                            </div>
                          );
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
                    {scienceArticles ? (
                      scienceArticles?.map(
                        (
                          article: {
                            title: string;
                            id: string;
                            mainContents: unknown;
                            searchInformation: unknown;
                            authorships: any[];
                          },
                          index: Key | null | undefined,
                        ) => (
                          <li
                            key={index}
                            className="science-article mb-4 flex items-start gap-6 rounded-sm border border-[#f2f4f8] p-4"
                          >
                            <Button>Save</Button>
                            <div className="flex flex-col">
                              <div
                                className={`flex ${article.isOpenAccess ? "flex-row gap-2" : "flex-col"}`}
                              >
                                {article.isOpenAccess && (
                                  <div className="mb-0 ml-2.5 mr-0 mt-2">
                                    <img
                                      className="openAccess_openAccessLogo__Q-5ld h-4"
                                      src={openAccessLogo}
                                      alt="Open Access Logo"
                                    />
                                  </div>
                                )}
                                <SimilarDocumentModal
                                  title={article.title}
                                  id={article.id}
                                  mainContents={article.mainContents}
                                  searchInformation={article.searchInformation}
                                  type="document"
                                  isOpenAccess={article.isOpenAccess}
                                />
                              </div>
                              {/* Publication Date and Authors */}
                              <div className="mt-2 flex flex-grow flex-wrap items-center gap-2">
                                {/* Publication Date */}
                                {fetchedDocument?.searchInformation.publicationDate && (
                                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                                    {fetchedDocument?.searchInformation.publicationDate}
                                  </span>
                                )}
                                {/* Authors */}
                                {article.authorships?.map(
                                  (
                                    author: { authorName: any },
                                    authorIndex: Key | null | undefined,
                                  ) => (
                                    <span
                                      key={authorIndex}
                                      className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                                    >
                                      {author.authorName || "Unknown Author"}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          </li>
                        ),
                      )
                    ) : (
                      <p>No document information available.</p>
                    )}
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="attachments">
                <h4 className="pb-2 font-black">Attachments</h4>
                {fetchedDocument?.attachedFiles && fetchedDocument?.attachedFiles.length > 0 ? (
                  <>
                    <div className="mb-4 flex items-center justify-start gap-2 rounded-sm bg-slate-100 p-4">
                      <ul>
                        {fetchedDocument.attachedFiles.map((file) => {
                          console.log(file);
                          return (
                            <li className="flex flex-row items-center gap-4">
                              <File size={16} />{" "}
                              <span>
                                {file.title}.{file.fileExtension}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <Button className="primary mt-2 bg-blue-500 p-4 text-white hover:bg-blue-300">
                      PREVIEW FILE
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-start gap-2 rounded-sm bg-slate-100 p-4">
                      <Upload size={14} />{" "}
                      <span>Add file (PDF, docx, pptx), maximum file size 50MB.</span>
                    </div>
                    <Button className="primary mt-2 bg-blue-500 p-4 text-white hover:bg-slate-200">
                      Add File
                    </Button>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
};

export default Document;
