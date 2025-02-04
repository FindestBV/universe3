import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Book, ChevronLeft, ChevronRight, Database, FileText } from "lucide-react";

import { useState } from "react";

type FormType = "page" | "query" | "document" | null;
type FormData = {
  type: FormType;
  title: string;
  description: string;
  // Page specific
  slug?: string;
  template?: string;
  // Query specific
  queryString?: string;
  parameters?: string;
  // Document specific
  content?: string;
  category?: string;
};

export function FormWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    type: null,
    title: "",
    description: "",
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (isStepValid()) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.type !== null;
      case 2:
        return formData.title.trim() !== "" && formData.description.trim() !== "";
      case 3:
        if (formData.type === "page") {
          return formData.slug?.trim() !== "" && formData.template?.trim() !== "";
        }
        if (formData.type === "query") {
          return formData.queryString?.trim() !== "";
        }
        if (formData.type === "document") {
          return formData.content?.trim() !== "" && formData.category?.trim() !== "";
        }
        return false;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Reset form
    setStep(1);
    setFormData({
      type: null,
      title: "",
      description: "",
    });
  };

  return (
    <div className="mx-auto h-full w-full p-6">
      <h2 className="mb-6 text-2xl font-semibold">
        Create New{" "}
        {formData.type ? formData.type.charAt(0).toUpperCase() + formData.type.slice(1) : "Item"}
      </h2>

      <div className="py-4">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2",
                  step >= num
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted",
                )}
              >
                {num}
              </div>
            ))}
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Type Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <RadioGroup
              value={formData.type || ""}
              onValueChange={(value) => updateFormData("type", value as FormType)}
            >
              <div className="flex cursor-pointer items-center space-x-2 rounded-lg border p-4 hover:bg-muted">
                <RadioGroupItem value="page" id="page" />
                <Label htmlFor="page" className="flex cursor-pointer items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Page
                </Label>
              </div>
              <div className="flex cursor-pointer items-center space-x-2 rounded-lg border p-4 hover:bg-muted">
                <RadioGroupItem value="query" id="query" />
                <Label htmlFor="query" className="flex cursor-pointer items-center gap-2">
                  <Database className="h-5 w-5" />
                  Query
                </Label>
              </div>
              <div className="flex cursor-pointer items-center space-x-2 rounded-lg border p-4 hover:bg-muted">
                <RadioGroupItem value="document" id="document" />
                <Label htmlFor="document" className="flex cursor-pointer items-center gap-2">
                  <Book className="h-5 w-5" />
                  Document
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 2: Basic Information */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                placeholder="Enter title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="Enter description"
              />
            </div>
          </div>
        )}

        {/* Step 3: Type-specific Fields */}
        {step === 3 && formData.type === "page" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug || ""}
                onChange={(e) => updateFormData("slug", e.target.value)}
                placeholder="Enter URL slug"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template">Template</Label>
              <Input
                id="template"
                value={formData.template || ""}
                onChange={(e) => updateFormData("template", e.target.value)}
                placeholder="Enter template name"
              />
            </div>
          </div>
        )}

        {step === 3 && formData.type === "query" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="queryString">Query String</Label>
              <Textarea
                id="queryString"
                value={formData.queryString || ""}
                onChange={(e) => updateFormData("queryString", e.target.value)}
                placeholder="Enter your query"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parameters">Parameters (optional)</Label>
              <Input
                id="parameters"
                value={formData.parameters || ""}
                onChange={(e) => updateFormData("parameters", e.target.value)}
                placeholder="Enter parameters"
              />
            </div>
          </div>
        )}

        {step === 3 && formData.type === "document" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category || ""}
                onChange={(e) => updateFormData("category", e.target.value)}
                placeholder="Enter category"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content || ""}
                onChange={(e) => updateFormData("content", e.target.value)}
                placeholder="Enter content"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="w-[100px]"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {step < 3 ? (
            <Button onClick={handleNext} disabled={!isStepValid()} className="w-[100px]">
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!isStepValid()} className="w-[100px]">
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FormWizard;
