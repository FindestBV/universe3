import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Bot } from "lucide-react";

const AskIgorModal: React.FC = () => {
  return (
    <Dialog>
      {/* Trigger to Open Dialog */}
      <DialogTrigger asChild>
        <div>
          <button className="flex items-center gap-1 rounded-md bg-white p-2 font-bold text-[#006A86] transition-all duration-150 ease-linear hover:bg-[#006A86] hover:text-white">
            <Bot className="h-4" />
            {/* <span className="md:block hidden">Ask IGOR<sup>AI</sup></span> */}
          </button>
        </div>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="z-[999] flex h-[80vh] max-w-5xl flex-col overflow-hidden rounded-lg border-none bg-white p-0 shadow-lg md:flex-row">
        <Tabs defaultValue="tab1" className="flex h-full w-full flex-row">
          {/* Left Panel */}
          <div className="w-full flex-shrink-0 bg-[#006A86] p-4 text-white md:w-1/3">
            <h1 className="mx-auto flex w-full justify-center gap-2 p-6 font-black">
              <Bot size={24} /> Ask IGOR
            </h1>
            <TabsList className="flex flex-col gap-2">
              <TabsTrigger
                value="tab1"
                className="w-full rounded-md px-4 py-2 text-left text-white hover:bg-gray-200 hover:text-black"
              >
                Question & Answer
              </TabsTrigger>

              <h5 className="text-normal mb-2 mt-8 pl-4 font-bold text-white">Generate</h5>

              <TabsTrigger
                value="tab2"
                className="w-full rounded-md px-4 py-2 text-left text-white hover:bg-gray-200 hover:text-black"
              >
                Report
              </TabsTrigger>
              <TabsTrigger
                value="tab3"
                className="w-full rounded-md px-4 py-2 text-left text-white hover:bg-gray-200 hover:text-black"
              >
                General Description
              </TabsTrigger>
              <TabsTrigger
                value="tab4"
                className="w-full rounded-md px-4 py-2 text-left text-white hover:bg-gray-200 hover:text-black"
              >
                Write Section
              </TabsTrigger>
              <TabsTrigger
                value="tab5"
                className="w-full rounded-md px-4 py-2 text-left text-white hover:bg-gray-200 hover:text-black"
              >
                Extract detail information
              </TabsTrigger>
              <TabsTrigger
                value="tab6"
                className="w-full rounded-md px-4 py-2 text-left hover:bg-gray-200 hover:text-black"
              >
                Executive Summary
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Right Panel */}
          <div className="w-full flex-grow p-4 md:w-2/3">
            <TabsContent value="tab1">
              <div className="flex items-start gap-4 p-4">
                <div className="flex items-center gap-2 font-black">
                  <Bot size={24} /> IGOR
                </div>
                <div className="flex flex-col">
                  <h4 className="text-lg font-semibold">
                    Ask me any question and I'll try to answer based on your sources
                  </h4>
                  <br />
                  <div className="mb-2 bg-gray-100 px-4 py-2">
                    Top 10 highlights, and top 10 documents incl. top 10 highlights per document.
                  </div>
                </div>
              </div>
              <hr />
              <div className="flex items-start gap-4 p-4">
                <div className="flex items-center gap-2 font-black">YOU</div>
                <div className="w-full">
                  <input
                    type="text"
                    className="my-2 block w-full rounded-md border px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter your question here"
                  />
                  <Button
                    type="button"
                    className="inline-flex flex-1 justify-center rounded-md border border-transparent bg-[#006A86] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    disabled
                  >
                    SUBMIT
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tab2">
              <div className="flex items-start gap-4 p-4">
                <div className="flex items-center gap-2 font-black">
                  <Bot size={24} /> IGOR
                </div>
                <div className="flex flex-col">
                  <h4 className="text-lg font-semibold">
                    I will write a report with an Intoduction, Methods, Results and conclusion based
                    on your sources
                  </h4>
                  <br />
                </div>
              </div>
              <hr />
              <div className="flex items-start gap-4 p-4">
                <div className="flex items-center gap-2 font-black">YOU</div>
                <div className="w-full">
                  <input
                    type="text"
                    className="my-2 block w-full rounded-md border px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter your question here"
                  />
                  <Button
                    type="button"
                    className="inline-flex flex-1 justify-center rounded-md border border-transparent bg-[#006A86] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    disabled
                  >
                    SUBMIT
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tab3">
              <div className="flex items-start gap-4 p-4">
                <div className="flex items-center gap-2 font-black">
                  <Bot size={24} /> IGOR
                </div>
                <div className="flex flex-col">
                  <h4 className="text-lg font-semibold">
                    I will write a general description about "Infrared Heaters". Do you want me to
                    write it based on your linked sources or general knowledge?
                  </h4>
                  <br />
                </div>
              </div>
              <hr />
              <div className="flex items-start gap-4 p-4">
                <div className="flex items-center gap-2 font-black">YOU</div>
                <div className="w-full">
                  <input
                    type="text"
                    className="my-2 block w-full rounded-md border px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter your question here"
                  />
                  <Button
                    type="button"
                    className="inline-flex flex-1 justify-center rounded-md border border-transparent bg-[#006A86] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    disabled
                  >
                    SUBMIT
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tab4">
              <div className="flex items-start gap-4 p-4">
                <div className="flex items-center gap-2 font-black">
                  <Bot size={24} /> IGOR
                </div>
                <div className="flex flex-col">
                  <h4 className="text-lg font-semibold">
                    Give me a header and I will write the section.
                  </h4>
                  <br />
                  <div className="bg-gray-100 px-4 py-2">
                    Top 10 highlights, and top 10 documents incl. top 10 highlights per document.
                  </div>
                </div>
              </div>
              <hr />
              <div className="flex items-start gap-4 p-4">
                <div className="flex items-center gap-2 font-black">YOU</div>
                <div className="w-full">
                  <input
                    type="text"
                    className="my-2 block w-full rounded-md border px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter your question here"
                  />
                  <Button
                    type="button"
                    className="inline-flex flex-1 justify-center rounded-md border border-transparent bg-[#006A86] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    disabled
                  >
                    SUBMIT
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tab5">
              <div className="flex items-start gap-4 p-4">
                <div className="flex items-center gap-2 font-black">
                  <Bot size={24} /> IGOR
                </div>
                <div className="flex flex-col">
                  <h4 className="text-lg font-semibold">
                    I will extract default information from your sources. Please provide me the
                    details you are looking for. Based on the selected object, I will try to add
                    some you may be interested in.{" "}
                  </h4>
                  <br />
                  <div className="bg-gray-100 px-4 py-2">All connected documents</div>
                </div>
              </div>
              <hr />
              <div className="flex items-start gap-4 p-4">
                <div className="flex items-center gap-2 font-black">YOU</div>
                <div className="w-full">
                  <input
                    type="text"
                    className="my-2 block w-full rounded-md border px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter your question here"
                  />
                  <Button
                    type="button"
                    className="inline-flex flex-1 justify-center rounded-md border border-transparent bg-[#006A86] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    disabled
                  >
                    SUBMIT
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tab6">
              <div className="flex items-start gap-4 p-4">
                <div className="flex items-center gap-2 font-black">
                  <Bot size={24} /> IGOR
                </div>
                <div className="flex flex-col">
                  <h4 className="text-lg font-semibold">
                    I will write and executive summary about "Infrared Heaters" based on the content
                    of the page, and your sources.
                  </h4>
                  <br />
                  <div className="bg-gray-100 px-4 py-2">
                    Page content, top 10 highlights, and top 10 documents incl. top 10 highlights
                    per document.
                  </div>
                </div>
              </div>
              <hr />
              <div className="flex items-start gap-4 p-4">
                <div className="flex items-center gap-2 font-black">YOU</div>
                <div className="w-full">
                  <Button
                    type="button"
                    className="inline-flex flex-1 justify-center rounded-md border border-transparent bg-[#006A86] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    disabled
                  >
                    SUBMIT
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AskIgorModal;
