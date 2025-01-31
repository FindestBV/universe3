import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ChevronLeft, Database, FileText, GraduationCap, X } from "lucide-react";

import { useState } from "react";

type FormType = "page" | "study" | "query" | null;
type FormData = {
  type: FormType;
  title: string;
  description: string;
};

export function CreateItemModal() {
  const [formData, setFormData] = useState<FormData>({
    type: null,
    title: "",
    description: "",
  });
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);

  const totalSteps = 3;

  const handleTypeSelect = (type: FormType) => {
    setFormData((prev) => ({ ...prev, type }));
    setStep(2);
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    if (step === 2) {
      setFormData((prev) => ({ ...prev, type: null }));
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const handleNext = () => {
    if (step === 2 && isValid()) {
      setStep(3);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    setOpen(false);
    // Reset form
    setFormData({
      type: null,
      title: "",
      description: "",
    });
    setStep(1);
  };

  const isValid = () => {
    return formData.title.trim() !== "" && formData.description.trim() !== "";
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "I would like to create a new...";
      case 2:
        return (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">I want to create a</span>
            <span className="text-2xl font-semibold capitalize text-[#006A86]">
              {formData.type}
            </span>
          </div>
        );
      case 3:
        return "Summary";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-[#006A86] text-white">
          CREATE NEW
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-w-[750px] [&>button]:hidden">
        <div className="mb-6 flex items-center gap-4">
          <DialogTitle className="text-lg">{getStepTitle()}</DialogTitle>

          {/* Progress Indicator */}
          <div className="flex flex-1 justify-end gap-2">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 w-2 rounded-full transition-all duration-300",
                  index + 1 === step
                    ? "w-6 bg-[#006A86]"
                    : index + 1 < step
                      ? "bg-[#006A86]"
                      : "bg-gray-200",
                )}
              />
            ))}
          </div>

          {/* Close button */}
          <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>

        <div className="py-4">
          {step === 1 && (
            // Type Selection Panel
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleTypeSelect("page")}
                className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-6 text-left transition-colors hover:bg-[#006A86]"
              >
                <div className="rounded-full bg-blue-50 p-3 group-hover:bg-white/90">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium group-hover:text-white">Page</h3>
                  <p className="text-sm text-gray-500 group-hover:text-white">
                    Create a new Entity within your universe
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleTypeSelect("study")}
                className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-6 text-left transition-colors hover:bg-[#006A86]"
              >
                <div className="rounded-full bg-green-50 p-3 group-hover:bg-white/90">
                  <GraduationCap className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium group-hover:text-white">Study</h3>
                  <p className="text-sm text-gray-500 group-hover:text-white">
                    Start a new research study, a workspace to gather and present acquired knowledge
                    and insights from your technical or scientific research studies.
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleTypeSelect("query")}
                className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-6 text-left transition-colors hover:bg-[#006A86]"
              >
                <div className="rounded-full bg-purple-50 p-3 group-hover:bg-white/90">
                  <Database className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium group-hover:text-white">Query</h3>
                  <p className="text-sm text-gray-500 group-hover:text-white">
                    Create a new query to search through millions of documents.
                  </p>
                </div>
              </button>
            </div>
          )}

          {step === 2 && (
            // Details Panel
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  placeholder={`Enter ${formData.type} title`}
                  className="w-full border border-gray-200 bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Type</Label>
                <select>
                  <option>Entity</option>
                  <option>Study</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  placeholder={`Describe your ${formData.type}`}
                  className="min-h-[100px] w-full border border-gray-200 bg-white"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex w-[100px] justify-start gap-2 bg-[#006A86] text-white"
                >
                  <ChevronLeft className="h-4 w-4 text-white" />
                  BACK
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!isValid()}
                  className={cn(
                    "w-[100px]",
                    isValid()
                      ? "bg-[#006A86] text-white hover:bg-[#005A76]"
                      : "bg-gray-100 text-gray-400",
                  )}
                >
                  CONTINUE
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            // Summary Panel
            <div className="space-y-6">
              <div className="space-y-4 rounded-lg border border-gray-200 p-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Type</h3>
                  <p className="text-lg font-semibold capitalize text-[#006A86]">{formData.type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Title</h3>
                  <p className="text-lg">{formData.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="text-base text-gray-700">{formData.description}</p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex w-[100px] justify-start gap-2 bg-[#006A86] text-white"
                >
                  <ChevronLeft className="h-4 w-4 text-white" />
                  BACK
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="w-[100px] bg-[#006A86] text-white hover:bg-[#005A76]"
                >
                  CREATE
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateItemModal;
