/**
 * AskIgorModal Component
 *
 * This component provides an interactive AI-powered search and query interface,
 * integrating with the LLM-based AskIgor model. It enables users to:
 *
 * - **Ask questions** via a prompt textarea.
 * - **Select from presets** for quick query generation.
 * - **Run new queries** and fetch AI-generated responses.
 * - **Manage query states**, including active and preloaded queries.
 * - **Minimize the modal** for background processing.
 * - **Interact with search results**, linked sources, and external documents.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} [props.isToolbar] - If true, modifies the modal for use within a toolbar.
 * @param {boolean} [props.iconOnly] - If true, displays only an icon instead of a full label.
 * @param {string} [props.label] - Custom label for the trigger button.
 * @param {Object[]} [props.preloadedQueries] - List of preloaded queries available on initialization.
 * @param {Object[]} [props.connectedQueries] - List of queries linked to existing documents.
 * @param {Function} [props.onRunQuery] - Callback function triggered when a new query is executed.
 * @param {Function} [props.onCancelQuery] - Callback function triggered when a query is canceled.
 *
 * @example
 * <AskIgorModal
 *   isToolbar={true}
 *   iconOnly={false}
 *   label="Ask Igor"
 *   preloadedQueries={[{ id: 1, question: "What is quantum computing?" }]}
 *   connectedQueries={[{ id: 2, question: "Related AI research" }]}
 *   onRunQuery={(query) => console.log("Running query:", query)}
 *   onCancelQuery={(queryId) => console.log("Cancelling query:", queryId)}
 * />
 *
 * @dependencies
 * - **ShadCN UI Components**: Dialog, Button, Textarea, Tabs
 * - **Radix UI**: Tabs, Dialog
 * - **Lucide Icons**: Zap, Check, File, FlaskConical, Maximize2, Minimize2, ChevronRight
 * - **Custom Hooks**: `useDebounce`, `useSemanticSearch`, `useSemanticSearchEditor`
 *
 * @returns {JSX.Element} The rendered AskIgorModal component.
 */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/use-debounce";
import { useSemanticSearch } from "@/hooks/use-semantic-search";
import { useSemanticSearchEditor } from "@/hooks/use-semantic-search-editor";
// import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
// import { EditorContent } from "@tiptap/react";
import {
  Award,
  Bot,
  Check,
  ChevronRight,
  File,
  FlaskConical,
  Globe,
  Link,
  Maximize2,
  Minimize2,
  X,
  Zap,
} from "lucide-react";

import { useState } from "react";

// import { toast } from "react-hot-toast";
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
          <h3 className="font-medium group-hover:text-white">{title}</h3>
          <p className="text-sm text-gray-600 group-hover:text-white">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4" />
    </Button>
  );
}

const AskIgorModal: React.FC = ({ ...props }: any) => {
  const [question, setQuestion] = useState("What do you want to ask about?");
  const [activeTab, setActiveTab] = useState("report");
  const [isMinimized, setIsMinimized] = useState(false); // Track minimization state
  const [isOpen, setIsOpen] = useState(false); // Track if modal is open
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string | undefined>();
  const debouncedContent = useDebounce(content, 1000);

  const { editor } = useSemanticSearchEditor({
    // editorProps: {
    //   attributes: {
    //     class: "askIgorModal",
    //   },
    // },
    onCreate: ({ editor }) => {
      // console.log("Editor Created:", editor);
      setContent(editor.getText());
    },
    onUpdate: ({ editor }) => {
      // console.log("Editor Updated:", editor);
      setContent(editor.getText());
    },
  });

  const { isSearching, results, groups } = useSemanticSearch(isOpen ? debouncedContent : undefined);

  return (
    <div className="askIgorModal">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/* Trigger to Open Dialog */}
        <DialogTrigger asChild>
          <div>
            <button
              className={`summonIgorBtn ${props?.isToolbar ? "toolBarIgor" : ""}`}
              onClick={() => {
                setIsMinimized(false);
                setIsOpen(true);
              }}
            >
              <Zap size={20} className="zppr" />
              {props?.iconOnly ? null : props?.label ? props.label : "Ask Igor"}
            </button>
          </div>
        </DialogTrigger>
        {/* Dialog Content */}
        {!isMinimized && (
          <DialogContent className="flex h-auto flex-col bg-white p-0 sm:max-w-[1000px] [&>button]:hidden">
            <DialogTitle className="hidden text-lg sm:text-xl">Ask Igor</DialogTitle>
            <div className="grid flex-grow grid-cols-1 gap-2 md:grid-cols-2">
              {/* Left Column - Input Section */}
              <div className="flex flex-col justify-between gap-12 p-6">
                <div>
                  <h1 className="mb-8 flex items-center gap-2 text-4xl font-black">
                    <Bot size={36} className="font-black" /> IGOR
                  </h1>
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
                      <FlaskConical size={16} />
                    </li>
                    <li className="flex items-center gap-1 rounded-sm bg-slate-100 p-1 text-sm">
                      <Check size={14} className="bg-blue-500 text-white" />
                      <Award size={16} />
                    </li>
                  </ul>

                  <div className="space-y-2">
                    <h5 className="text-sm font-bold">Ask me anything about the linked sources</h5>
                    <div className="relative">
                      <Textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Type your question here..."
                        className="min-h-[120px] resize-none bg-white pr-12 focus:outline-none focus-visible:ring-offset-0"
                      />
                      <Button
                        size="icon"
                        className="absolute bottom-3 right-3 bg-blue-500 text-white hover:bg-slate-300"
                        onClick={() => console.log("search")}
                      />
                      {/* {editor ? (
                        <>
                          <EditorContent
                            editor={editor}
                            className="askIgorEditor w-full rounded-sm bg-slate-200"
                          />
                        </>
                      ) : (
                        <p>Loading editor...</p>
                      )} */}

                      <Button
                        size="icon"
                        className="absolute bottom-3 right-3 bg-blue-500 text-white hover:bg-slate-300"
                        onClick={() => console.log("search")}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-sm font-bold">Or pick a preset</h5>
                  <Tabs defaultValue="report" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="flex w-full justify-start gap-2 border-b border-slate-300">
                      <TabsTrigger
                        value="report"
                        className={`linear px-4 py-2 text-sm transition-all duration-150 ${
                          activeTab === "report"
                            ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                            : "text-gray-500"
                        }`}
                      >
                        Report
                      </TabsTrigger>
                      <TabsTrigger
                        value="extract"
                        className={`linear p-2 text-sm transition-all duration-150 ${
                          activeTab === "extract"
                            ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                            : "text-gray-500"
                        }`}
                      >
                        Extract information
                      </TabsTrigger>
                      <TabsTrigger
                        value="other"
                        className={`linear p-2 text-sm transition-all duration-150 ${
                          activeTab === "other"
                            ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                            : "text-gray-500"
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
                        title="Standard Report"
                        description="Introduction, methods, results and conclusion."
                        className="bg-slate-100"
                      />
                      <PresetButton
                        title="Tailored Report"
                        description="Introduction, methods, results and conclusion."
                        className="bg-slate-100"
                      />
                    </TabsContent>
                    <TabsContent value="extract" className="mt-2 space-y-2">
                      <PresetButton
                        title="Extract Information"
                        description="Search through specific documents."
                        className="bg-slate-100"
                      />
                      <PresetButton
                        title="Extract Patents"
                        description="Search through specific documents."
                        className="bg-slate-100"
                      />
                      <PresetButton
                        title="Extract Scientific Publications"
                        description="Search through specific documents."
                        className="bg-slate-100"
                      />
                      <PresetButton
                        title="Extract from Scientific Topics"
                        description="Search through specific documents."
                        className="bg-slate-100"
                      />
                    </TabsContent>
                    <TabsContent value="other" className="mt-2 space-y-2">
                      <PresetButton
                        title="Other general keyword"
                        description="Either based on general knowledge or the sources linked."
                        className="bg-slate-100"
                      />
                      <PresetButton
                        title="General description"
                        description="Either based on general knowledge or the sources linked."
                        className="bg-slate-100"
                      />
                      <PresetButton
                        title="Waterboarding"
                        description="Either based on general knowledge or the sources linked."
                        className="bg-slate-100"
                      />
                      <PresetButton
                        title="Sleep deprevation"
                        description="Either based on general knowledge or the sources linked."
                        className="bg-slate-100"
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              {/* Right Column - Output Section */}
              <div className="flex h-full flex-col">
                {/* Minimize & Close Buttons (Top Right) */}
                <div className="absolute right-0 flex justify-end gap-0 p-4">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="rounded border p-2 text-sm text-gray-500 hover:bg-gray-200"
                  >
                    <Minimize2 size={16} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded border p-2 text-sm text-gray-500 hover:bg-gray-200"
                  >
                    <X size={16} />
                  </button>
                </div>

                <aside className={"Search"}>
                  <strong>Existing documents</strong>
                  <div className={"divider"} />
                  {isSearching ? (
                    <div className="hint purple-spinner">Sort by highest match...</div>
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
                </aside>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Minimized View */}
      {isMinimized && (
        <div
          className={`minimizedDialog ${loading ? "bg-[#84A7E2]" : "bg-yellow-400"}`}
          onClick={() => {
            setIsMinimized(false);
            setIsOpen(true);
          }}
        >
          <p className={`flex gap-2 text-sm ${loading ? "text-white" : "text-black"}`}>
            <Zap className={`${loading ? "" : "zppr"}`} />{" "}
            {loading ? "Asking IGOR..." : "Search complete!"}
          </p>
          <button className={`text-sm ${loading ? "text-white" : "text-black"}`}>
            <Maximize2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AskIgorModal;
