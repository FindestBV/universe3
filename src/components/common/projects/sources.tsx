/**
 * Project Sources component provides an overview of project Pages with tab navigation.
 * This is Relevant for Universe Projects/Sources
 *
 * @component
 * @example
 *
 * @returns {JSX.Element} A project overview component with dynamic tab functionality.
 */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { useState } from "react";

import AskIgorModal from "../dialogs/ask-igor";

export const ProjectSources = () => {
  const [activeTabActive, setIsActiveTabActive] = useState<string>("all");

  const [tabs, setTabs] = useState([
    { id: "all", label: "All Source Types" },
    { id: "science", label: "Science" },
    { id: "patents", label: "Patents" },
    { id: "websites", label: "Websites" },
  ]);

  // Function to add a new tab with a user-defined label
  const addNewTab = () => {
    const newLabel = window.prompt("Enter a name for the new tab:", `New Tab ${tabs.length + 1}`);
    if (!newLabel) return; // Prevent adding empty tabs

    const newId = `tab-${tabs.length + 1}`;
    setTabs([...tabs, { id: newId, label: newLabel }]);
    setIsActiveTabActive(newId);
  };

  // Function to rename an existing tab
  const renameTab = (id: string) => {
    const newLabel = window.prompt("Rename this tab:");
    if (!newLabel) return;

    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === id ? { ...tab, label: newLabel } : tab)),
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="min-h-full" id="project-sources">
        <div className="mx-auto max-w-full p-8">
          <div className="mt-0">
            <Tabs defaultValue="all" className="pb-4" onValueChange={setIsActiveTabActive}>
              <TabsList className="flex w-full items-center justify-between border-b border-slate-300 bg-transparent">
                <div className="flex gap-2">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={`p-2 text-sm ${activeTabActive === tab.id ? "border-b-2 border-blue-800 bg-blue-200 font-bold" : "text-black"}`}
                      onDoubleClick={() => renameTab(tab.id)} // Double-click to rename
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={addNewTab}
                    className="flex items-center rounded-md p-2 text-gray-600 hover:bg-gray-200"
                  >
                    <Plus className="h-5 w-8" />
                  </button>
                  <AskIgorModal iconOnly={true} />
                </div>
              </TabsList>

              <TabsContent value="all" className="mt-2 space-y-2">
                <div className="overviewHeader py-4">
                  <h1 className="mb-2 text-4xl font-bold">Sources</h1>
                  <p className="mb-4 text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam autem, deleniti
                    ratione fuga consectetur sint unde nostrum, numquam corrupti esse, porro ullam
                    dolorum. Repudiandae laborum sit fugit. Ipsum odit mollitia molestiae nobis
                    asperiores laborum, modi quos quisquam quibusdam, consectetur nostrum officiis
                    veritatis iure ab distinctio, veniam nesciunt voluptas sed! Magnam praesentium
                    id tenetur ducimus error magni quidem similique suscipit ad animi consequatur
                    ipsa nobis numquam qui sed ullam nulla, voluptatibus iusto eaque accusantium
                    sapiente.
                  </p>
                </div>
                <div className="w-full">
                  <div className="flex flex-col">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div className="itemCard">
                        <div className="innerCardMain bg-white">
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked="false"
                            data-state="unchecked"
                            value="on"
                            className="innerCardCheckbox peer h-4 w-4 shrink-0 rounded-sm border border-secondary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            id="card-08dd4b67-baaa-41d8-86d7-4e94efd0c886"
                          ></button>
                          <div className="innerCardContent">
                            <div className="innerCardContent__Detail">
                              <div className="flex flex-col">
                                <h3 className="overflow-hidden text-ellipsis py-0 text-lg font-bold text-black">
                                  Radiomics and Machine Learning in Medical Imaging
                                </h3>
                                <div>
                                  <p className="!important text-xs"></p>
                                </div>
                              </div>
                              <div className="innerCardContent__Links">
                                <ul className="linkedCounts flex flex-wrap gap-2">
                                  <li
                                    className="linkedCounts__item documentCount"
                                    data-state="closed"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      className="lucide lucide-book-open-check"
                                    >
                                      <path d="M12 21V7"></path>
                                      <path d="m16 12 2 2 4-4"></path>
                                      <path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3"></path>
                                    </svg>
                                    5
                                  </li>
                                  <li className="linkedCounts__item studyCount" data-state="closed">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      className="lucide lucide-book-open-check"
                                    >
                                      <path d="M12 21V7"></path>
                                      <path d="m16 12 2 2 4-4"></path>
                                      <path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3"></path>
                                    </svg>
                                    1
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="flex flex-row items-start gap-2">
                              <div className="flex flex-row items-center gap-4">
                                <div className="time">Feb 12</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative flex h-auto w-[25px]">
                          <div className="links">
                            <div className="linkToItem">
                              <a
                                href="#"
                                className="linkedStudy"
                                type="button"
                                aria-haspopup="dialog"
                                aria-expanded="false"
                                aria-controls="radix-:rl:"
                                data-state="closed"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  className="lucide lucide-link"
                                >
                                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                </svg>
                              </a>
                            </div>
                            <a href="#" className="trashCan">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="lucide lucide-trash2"
                              >
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                <line x1="10" x2="10" y1="11" y2="17"></line>
                                <line x1="14" x2="14" y1="11" y2="17"></line>
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="science" className="mt-2 space-y-2">
                <div className="w-full">
                  <div className="flex flex-col">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div className="itemCard">
                        <div className="innerCardMain bg-white">
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked="false"
                            data-state="unchecked"
                            value="on"
                            className="innerCardCheckbox peer h-4 w-4 shrink-0 rounded-sm border border-secondary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            id="card-08dd4b67-baaa-41d8-86d7-4e94efd0c886"
                          ></button>
                          <div className="innerCardContent">
                            <div className="innerCardContent__Detail">
                              <div className="flex flex-col">
                                <h3 className="overflow-hidden text-ellipsis py-0 text-lg font-bold text-black">
                                  Radiomics and Machine Learning in Medical Imaging
                                </h3>
                                <div>
                                  <p className="!important text-xs"></p>
                                </div>
                              </div>
                              <div className="innerCardContent__Links">
                                <ul className="linkedCounts flex flex-wrap gap-2">
                                  <li
                                    className="linkedCounts__item documentCount"
                                    data-state="closed"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      className="lucide lucide-book-open-check"
                                    >
                                      <path d="M12 21V7"></path>
                                      <path d="m16 12 2 2 4-4"></path>
                                      <path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3"></path>
                                    </svg>
                                    5
                                  </li>
                                  <li className="linkedCounts__item studyCount" data-state="closed">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      className="lucide lucide-book-open-check"
                                    >
                                      <path d="M12 21V7"></path>
                                      <path d="m16 12 2 2 4-4"></path>
                                      <path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3"></path>
                                    </svg>
                                    1
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="flex flex-row items-start gap-2">
                              <div className="flex flex-row items-center gap-4">
                                <div className="time">Feb 12</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative flex h-auto w-[25px]">
                          <div className="links">
                            <div className="linkToItem">
                              <a
                                href="#"
                                className="linkedStudy"
                                type="button"
                                aria-haspopup="dialog"
                                aria-expanded="false"
                                aria-controls="radix-:rl:"
                                data-state="closed"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  className="lucide lucide-link"
                                >
                                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                </svg>
                              </a>
                            </div>
                            <a href="#" className="trashCan">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="lucide lucide-trash2"
                              >
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                <line x1="10" x2="10" y1="11" y2="17"></line>
                                <line x1="14" x2="14" y1="11" y2="17"></line>
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="patents" className="mt-2 space-y-2">
                <div className="w-full">
                  <div className="flex flex-col">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div className="itemCard">
                        <div className="innerCardMain bg-white">
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked="false"
                            data-state="unchecked"
                            value="on"
                            className="innerCardCheckbox peer h-4 w-4 shrink-0 rounded-sm border border-secondary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            id="card-08dd4b67-baaa-41d8-86d7-4e94efd0c886"
                          ></button>
                          <div className="innerCardContent">
                            <div className="innerCardContent__Detail">
                              <div className="flex flex-col">
                                <h3 className="overflow-hidden text-ellipsis py-0 text-lg font-bold text-black">
                                  Radiomics and Machine Learning in Medical Imaging
                                </h3>
                                <div>
                                  <p className="!important text-xs"></p>
                                </div>
                              </div>
                              <div className="innerCardContent__Links">
                                <ul className="linkedCounts flex flex-wrap gap-2">
                                  <li
                                    className="linkedCounts__item documentCount"
                                    data-state="closed"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      className="lucide lucide-book-open-check"
                                    >
                                      <path d="M12 21V7"></path>
                                      <path d="m16 12 2 2 4-4"></path>
                                      <path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3"></path>
                                    </svg>
                                    5
                                  </li>
                                  <li className="linkedCounts__item studyCount" data-state="closed">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      className="lucide lucide-book-open-check"
                                    >
                                      <path d="M12 21V7"></path>
                                      <path d="m16 12 2 2 4-4"></path>
                                      <path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3"></path>
                                    </svg>
                                    1
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="flex flex-row items-start gap-2">
                              <div className="flex flex-row items-center gap-4">
                                <div className="time">Feb 12</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative flex h-auto w-[25px]">
                          <div className="links">
                            <div className="linkToItem">
                              <a
                                href="#"
                                className="linkedStudy"
                                type="button"
                                aria-haspopup="dialog"
                                aria-expanded="false"
                                aria-controls="radix-:rl:"
                                data-state="closed"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  className="lucide lucide-link"
                                >
                                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                </svg>
                              </a>
                            </div>
                            <a href="#" className="trashCan">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="lucide lucide-trash2"
                              >
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                <line x1="10" x2="10" y1="11" y2="17"></line>
                                <line x1="14" x2="14" y1="11" y2="17"></line>
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="websites" className="mt-2 space-y-2">
                <div className="w-full">
                  <div className="flex flex-col">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div className="itemCard">
                        <div className="innerCardMain bg-white">
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked="false"
                            data-state="unchecked"
                            value="on"
                            className="innerCardCheckbox peer h-4 w-4 shrink-0 rounded-sm border border-secondary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            id="card-08dd4b67-baaa-41d8-86d7-4e94efd0c886"
                          ></button>
                          <div className="innerCardContent">
                            <div className="innerCardContent__Detail">
                              <div className="flex flex-col">
                                <h3 className="overflow-hidden text-ellipsis py-0 text-lg font-bold text-black">
                                  Radiomics and Machine Learning in Medical Imaging
                                </h3>
                                <div>
                                  <p className="!important text-xs"></p>
                                </div>
                              </div>
                              <div className="innerCardContent__Links">
                                <ul className="linkedCounts flex flex-wrap gap-2">
                                  <li
                                    className="linkedCounts__item documentCount"
                                    data-state="closed"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      className="lucide lucide-book-open-check"
                                    >
                                      <path d="M12 21V7"></path>
                                      <path d="m16 12 2 2 4-4"></path>
                                      <path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3"></path>
                                    </svg>
                                    5
                                  </li>
                                  <li className="linkedCounts__item studyCount" data-state="closed">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      className="lucide lucide-book-open-check"
                                    >
                                      <path d="M12 21V7"></path>
                                      <path d="m16 12 2 2 4-4"></path>
                                      <path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3"></path>
                                    </svg>
                                    1
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="flex flex-row items-start gap-2">
                              <div className="flex flex-row items-center gap-4">
                                <div className="time">Feb 12</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative flex h-auto w-[25px]">
                          <div className="links">
                            <div className="linkToItem">
                              <a
                                href="#"
                                className="linkedStudy"
                                type="button"
                                aria-haspopup="dialog"
                                aria-expanded="false"
                                aria-controls="radix-:rl:"
                                data-state="closed"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  className="lucide lucide-link"
                                >
                                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                </svg>
                              </a>
                            </div>
                            <a href="#" className="trashCan">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="lucide lucide-trash2"
                              >
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                <line x1="10" x2="10" y1="11" y2="17"></line>
                                <line x1="14" x2="14" y1="11" y2="17"></line>
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectSources;
