import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Brain, ChevronRight, FileText, Globe, TestTubes } from "lucide-react";

import { useState } from "react";

export function AiDialog() {
  const [question, setQuestion] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Ask AI</Button>
      </DialogTrigger>
      <DialogContent className="flex h-[600px] flex-col sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Brain className="h-6 w-6" />
            Linked sources
            <div className="ml-4 flex items-center gap-2">
              <span className="rounded-md bg-blue-600 px-2 py-1 text-sm text-white">15</span>
              <span className="rounded-md bg-orange-400 px-2 py-1 text-sm text-white">150</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex flex-grow flex-col gap-6">
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Ask me anything about the linked sources</h2>
            <div className="relative">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question here..."
                className="min-h-[120px] resize-none pr-12"
              />
              <Button size="icon" className="absolute bottom-3 right-3">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Or pick a preset</h2>
            <Tabs defaultValue="report" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="report">Report</TabsTrigger>
                <TabsTrigger value="extract">Extract information</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>
              <TabsContent value="report" className="mt-4 space-y-4">
                <PresetButton
                  title="General description"
                  description="Either based on general knowledge or the sources linked."
                  icon={Globe}
                />
                <PresetButton
                  title="Section"
                  description="Give me a title and I will write the section."
                  icon={FileText}
                />
                <PresetButton
                  title="Standard report"
                  description="Introduction, Methods, Results, and Conclusion."
                  icon={TestTubes}
                />
                <PresetButton
                  title="Tailored report"
                  description="Introduction, Methods, Results, and Conclusion."
                  icon={FileText}
                />
              </TabsContent>
              <TabsContent value="extract">
                {/* Add extract information presets here */}
              </TabsContent>
              <TabsContent value="other">{/* Add other presets here */}</TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PresetButton({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Button variant="outline" className="group h-auto w-full justify-between p-4">
      <div className="flex items-start gap-4">
        <Icon className="mt-1 h-5 w-5" />
        <div className="text-left">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
    </Button>
  );
}
