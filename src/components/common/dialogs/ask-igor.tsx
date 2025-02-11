import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/use-debounce";
import { useSemanticSearch } from "@/hooks/use-semantic-search";
import { useSemanticSearchEditor } from "@/hooks/use-semantic-search-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
// import { EditorContent } from "@tiptap/react";
import { Check, ChevronRight, File, Globe, Link, Zap } from "lucide-react";

import { useState } from "react";

// import LinkedCounts from "../cards/linked-counts";

function PresetButton({
  title,
  description,
}: {
  title: string;
  description: string;
  className: string;
}) {
  return (
    <Button
      variant="ghost"
      className="group h-auto w-full justify-between bg-slate-100 p-2 hover:bg-slate-400"
    >
      <div className="flex items-start gap-4">
        <div className="text-left">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-600 group-hover:text-white">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4" />
    </Button>
  );
}

const AskIgorModal: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [content, setContent] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState("report");

  const debouncedContent = useDebounce(content, 1000);

  const { editor } = useSemanticSearchEditor({
    onCreate: ({ editor }) => setContent(editor.getText()),
    onUpdate: ({ editor }) => setContent(editor.getText()),
  });

  const { isSearching, results, groups } = useSemanticSearch(debouncedContent);

  return (
    <div className="askIgorModal">
      <Dialog>
        {/* Trigger to Open Dialog */}
        <DialogTrigger asChild>
          <div>
            <button className="summonIgorBtn">
              <Zap size={20} className="zppr" />
              Ask IGOR
            </button>
          </div>
        </DialogTrigger>

        {/* Dialog Content */}
        <DialogContent className="flex h-auto flex-col bg-white p-0 sm:max-w-[1000px]">
          <div className="grid flex-grow grid-cols-1 gap-2 md:grid-cols-2">
            {/* Left Column - Input Section */}
            <div className="flex flex-col justify-between gap-12 p-6">
              <div>
                <h1 className="mb-8 text-4xl font-bold">IGOR</h1>
                <p className="iconText py-2 font-black">Linked sources</p>

                {/* Compose from LinkedCounts ? */}
                <ul className="flex gap-2 pb-4">
                  <li className="flex items-center gap-1 rounded-sm bg-slate-100 p-1 text-sm">
                    <File size={16} className="rounded-sm bg-blue-800 px-1 text-white" />
                    <span>15</span>
                  </li>
                  <li className="flex items-center gap-1 rounded-sm bg-slate-100 p-1 text-sm">
                    <Link size={16} className="rounded-sm bg-orange-500 p-1 text-white" />
                    <span>150</span>
                  </li>
                  <li className="flex items-center gap-1 rounded-sm bg-slate-100 p-1 text-sm">
                    <Check size={14} className="bg-blue-500 text-white" />
                    <Globe size={16} />
                  </li>
                  <li className="flex items-center gap-1 rounded-sm bg-slate-100 p-1 text-sm">
                    <Check size={14} className="bg-blue-500 text-white" />
                    <Globe size={16} />
                  </li>
                  <li className="flex items-center gap-1 rounded-sm bg-slate-100 p-1 text-sm">
                    <Check size={14} className="bg-blue-500 text-white" />
                    <Globe size={16} />
                  </li>
                </ul>

                <div className="space-y-2">
                  <h5 className="text-sm font-bold">Ask me anything about the linked sources</h5>
                  <div className="relative">
                    {/* <EditorContent editor={editor}   className="min-h-[120px] resize-none bg-white pr-12 focus:outline-none" /> */}
                    <Textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Type your question here..."
                      className="min-h-[120px] resize-none bg-white pr-12 focus:outline-none"
                    />
                    <Button
                      size="icon"
                      className="absolute bottom-3 right-3 bg-blue-500 text-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-sm font-bold">Or pick a preset</h5>
                {/* <Tabs defaultValue="report" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="flex w-full justify-start gap-2 border-b border-slate-300">
                    <TabsTrigger
                      value="report"
                      className={`p-2 text-sm font-bold ${
                        activeTab === "report"
                          ? "border-b-2 border-blue-800 bg-blue-100"
                          : "text-gray-400"
                      }`}
                    >
                      Report
                    </TabsTrigger>
                    <TabsTrigger
                      value="extract"
                      className={`p-2 text-sm font-bold ${
                        activeTab === "extract"
                          ? "border-b-2 border-blue-800 bg-blue-100"
                          : "text-gray-400"
                      }`}
                    >
                      Extract information
                    </TabsTrigger>
                    <TabsTrigger
                      value="other"
                      className={`p-2 text-sm font-bold ${
                        activeTab === "other"
                          ? "border-b-2 border-blue-800 bg-blue-100"
                          : "text-gray-400"
                      }`}
                    >
                      Other
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="report" className="mt-2 space-y-2">
                    <PresetButton
                      title="General description"
                      description="Either based on general knowledge or the sources linked."
                      className="bg-slate-100"
                    />
                    <PresetButton
                      title="Section"
                      description="Give me a title and I will write the section."
                      className="bg-slate-100"
                    />
                    <PresetButton
                      title="Standard report"
                      description="Introduction, Methods, Results, and Conclusion."
                      className="bg-slate-100"
                    />
                    <PresetButton
                      title="Tailored report"
                      description="Introduction, Methods, Results, and Conclusion."
                      className="bg-slate-100"
                    />
                  </TabsContent>
                  <TabsContent value="extract" className="mt-4 space-y-2">
                    <PresetButton
                      title="Tailored report"
                      description="Introduction, Methods, Results, and Conclusion."
                      className="bg-slate-100"
                    />
                    <PresetButton
                      title="Standard report"
                      description="Introduction, Methods, Results, and Conclusion."
                      className="bg-slate-100"
                    />
                    <PresetButton
                      title="Tailored report"
                      description="Introduction, Methods, Results, and Conclusion."
                      className="bg-slate-100"
                    />
                  </TabsContent>
                  <TabsContent value="other" className="mt-4 space-y-2">
                    <PresetButton
                      title="Tailored report"
                      description="Introduction, Methods, Results, and Conclusion."
                      className="bg-slate-100"
                    />
                    <PresetButton
                      title="Standard report"
                      description="Introduction, Methods, Results, and Conclusion."
                      className="bg-slate-100"
                    />
                  </TabsContent>
                </Tabs> */}
                <Tabs defaultValue="report" className="w-full" onValueChange={setActiveTab}>
                  {/* Tabs List with Animated Underline */}
                  <TabsList className="relative flex w-full justify-start gap-2 border-b border-slate-300">
                    {["report", "extract", "other"].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className={`relative p-2 text-sm font-bold transition-all ${
                          activeTab === tab ? "text-blue-800" : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        {activeTab === tab && (
                          <motion.div
                            className="absolute bottom-0 left-0 h-[2px] w-full bg-blue-800"
                            // transition={{ type: "slide", stiffness: 300, damping: 20 }}
                          />
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Tabs Content with Smooth Transition */}
                  <motion.div
                    key={activeTab}
                    // initial={{ opacity: 0, y: 10 }}
                    // animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TabsContent value="report" className="mt-2 space-y-2">
                      <PresetButton
                        title="General description"
                        description="Based on general knowledge or sources linked."
                      />
                      <PresetButton
                        title="Section"
                        description="Give me a title, and I'll write the section."
                      />
                      <PresetButton
                        title="Standard report"
                        description="Introduction, Methods, Results, Conclusion."
                      />
                      <PresetButton
                        title="Tailored report"
                        description="Custom Introduction, Methods, Results, Conclusion."
                      />
                    </TabsContent>

                    <TabsContent value="extract" className="mt-2 space-y-2">
                      <PresetButton
                        title="Extract key points"
                        description="Summarize the essential information from sources."
                      />
                      <PresetButton
                        title="Standard report"
                        description="Generate a structured report from extracted data."
                      />
                    </TabsContent>

                    <TabsContent value="other" className="mt-2 space-y-2">
                      <PresetButton
                        title="Custom request"
                        description="Specify exactly what you need."
                      />
                      <PresetButton
                        title="Alternative formats"
                        description="Generate data in different formats (JSON, CSV, etc.)."
                      />
                    </TabsContent>
                  </motion.div>
                </Tabs>
              </div>
            </div>

            {/* Right Column - Output Section */}
            <div className="flex h-full flex-col">
              <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                <div className="divider" />
                {isSearching ? (
                  <div className="hint purple-spinner">
                    <p className="text-sm text-gray-500">This is some text to represent</p>
                  </div>
                ) : null}
                {!isSearching && groups && groups.length
                  ? groups.map((group, i) => {
                      return (
                        <div key={group.name} className={"SearchResultGroup"}>
                          <div className={"SearchResultGroup__Header"}>
                            <div className={"SearchResultGroup__Title"}>
                              Matching score {i === 0 && "🔥"} {i === 1 && "🏄🏼‍♂️"} {i === 2 && "🍐"}
                            </div>
                            <div className={"SearchResultGroup__Similarity"}>
                              {group.similarity.from === group.similarity.to
                                ? `>= ${(group.similarity.from * 100).toFixed(0)}`
                                : `${(group.similarity.from * 100).toFixed(0)} - ${(
                                    group.similarity.to * 100
                                  ).toFixed(0)}`}
                              %
                            </div>
                          </div>
                          {group.results && group.results.length
                            ? group.results.map((document, i) => (
                                <details
                                  key={`${i}-${document.name}`}
                                  className={"SearchResultItem"}
                                >
                                  <summary className={"SearchResultItem__Summary"}>
                                    <div className={"SearchResultItem__Header"}>
                                      <div className={"SearchResultItem__Title"}>
                                        {document.name}
                                      </div>
                                      <div className={"SearchResultItem__Similarity"}>
                                        {(document.cosine_similarity * 100).toFixed(0)}%
                                      </div>
                                    </div>
                                  </summary>

                                  <div className={"SearchResultItem__Content"}>
                                    {document.content}
                                  </div>
                                </details>
                              ))
                            : null}
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AskIgorModal;
