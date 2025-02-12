import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
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
  const [activeTab, setActiveTab] = useState("report");

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
                <Tabs defaultValue="report" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="flex w-full justify-start gap-2 border-b border-slate-300">
                    <TabsTrigger
                      value="report"
                      className={`p-2 text-sm ${
                        activeTab === "report"
                          ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                          : "text-gray-500"
                      }`}
                    >
                      Report
                    </TabsTrigger>
                    <TabsTrigger
                      value="extract"
                      className={`p-2 text-sm ${
                        activeTab === "extract"
                          ? "border-b-2 border-blue-800 bg-blue-100 font-bold"
                          : "text-gray-500"
                      }`}
                    >
                      Extract information
                    </TabsTrigger>
                    <TabsTrigger
                      value="other"
                      className={`p-2 text-sm ${
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
                </Tabs>
              </div>
            </div>

            {/* Right Column - Output Section */}
            <div className="flex h-full flex-col">
              <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                <p className="text-sm text-gray-500">This is some text to represent</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AskIgorModal;
