/**
 * CreateTechOverviewDialog Component
 *
 * This component provides a **multi-step form** to create a **Technology Overview** project.
 * It is designed to help users **structure scientific landscapes** and visualize research
 * areas using a **graph-based approach**.
 *
 * ## Features:
 * - **Step-based project creation** guiding users through the setup process.
 * - **Supports multiple entity types** (`Page`, `Study`, `Query`).
 * - **Graph-based representation** to map relationships between research topics.
 * - **Dynamic input fields** based on selection.
 * - **Predefined templates** for structuring research projects.
 * - **Validation for required fields** before submission.
 *
 * ## Customization:
 * - **Modify the project structure** in the `handleTypeSelect` and `updateFormData` functions.
 * - **Adjust graph rendering settings** to visualize research data connections.
 * - **Customize query parameters** inside the queryTemplates array.
 * - **Update the result visualization** inside the final project overview.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.title] - Custom dialog title (defaults to "Create new project").
 * @param {string} [props.type] - Type of project (e.g., "techoverview" for tech landscapes).
 *
 * @example
 * <CreateTechOverviewDialog title="Create Tech Landscape" type="techoverview" />
 *
 * @dependencies
 * - **ShadCN UI Components**: Dialog, DialogTrigger, DialogContent, DialogTitle, Button, Card
 * - **Lucide Icons**: Plus
 * - **React Hooks**: useState (for managing steps and form input)
 * - **Graph Visualization**: (Future Implementation) for mapping technology landscapes.
 *
 * @returns {JSX.Element} The rendered CreateTechOverviewDialog component.
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

import { useState } from "react";

type FormType = "page" | "study" | "query" | null;
type PageType = "entity" | "document" | "study" | "webpage" | null;

type FormData = {
  type: FormType;
  title: string;
  description: string;
  pageType?: PageType;
  webpageUrl?: string;
  queryTemplate?: string;
};

const queryTemplates = [
  {
    id: "basic_search",
    name: "Basic Search",
    query: "SELECT * FROM documents WHERE title LIKE :searchTerm",
    parameters: ["searchTerm"],
  },
  {
    id: "advanced_filter",
    name: "Advanced Filter",
    query: "SELECT * FROM documents WHERE category = :category AND created_at > :date",
    parameters: ["category", "date"],
  },
];

export function CreateTechOverviewDialog({ ...props }: any) {
  const [formData, setFormData] = useState<FormData>({
    type: null,
    title: "",
    description: "",
    pageType: null,
    webpageUrl: "",
    queryTemplate: "",
  });
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const dialogTitle = props?.title;
  const dialogType = props?.type;

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
      pageType: null,
      webpageUrl: "",
      queryTemplate: "",
    });
    setStep(1);
  };

  const isValid = () => {
    if (!formData.title.trim()) return false;

    if (formData.type === "page") {
      if (formData.pageType === "webpage") {
        return Boolean(formData.webpageUrl?.trim());
      }
    }

    if (formData.type === "query") {
      return Boolean(formData.queryTemplate);
    }

    return Boolean(formData.description.trim());
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Create a new Project";
      case 2:
        return (
          <div className="flex items-center gap-2">
            <span className="text-lg text-gray-500">I want to create a new Project</span>
            <span className="text-2xl font-semibold capitalize text-blue-300">{formData.type}</span>
          </div>
        );
      case 3:
        return "Summary";
      default:
        return "";
    }
  };

  const handleQueryTemplateSelect = (templateId: string) => {
    const template = queryTemplates.find((t) => t.id === templateId);
    if (template) {
      updateFormData("queryTemplate", templateId);
    }
  };

  return (
    <div className="createProjectDialog">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {dialogType && dialogType == "findest-button" ? (
            <Button className="border border-slate-300 bg-slate-100 text-black hover:bg-slate-200">
              <Plus /> Create New project
            </Button>
          ) : (
            <div className="trigger">
              <p className="title">{dialogTitle ? dialogTitle : "Create new project"}</p>
              <div className="icon">
                <Plus size={20} className="text-white" />
              </div>
            </div>
          )}
        </DialogTrigger>
        <DialogContent className="h-auto max-w-2xl overflow-auto rounded-lg bg-white p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle>
              <h2 className="py-4 text-3xl">Create scientific landscape</h2>
            </DialogTitle>
            <DialogDescription className="text-sm">
              Finding documents can be done in multiple ways. You can browse the internet and find
              relevant sources there and add them through your project with our browser extension.
              But we recommend using our powerful search engine.
            </DialogDescription>
          </DialogHeader>

          {/* Content Sections */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">Structure scientific landscape</p>

            <ul>
              <li>
                <Card>
                  <CardContent className="rounded-md bg-gray-100 p-4">
                    <p className="text-sm font-semibold">Executive Summary/Answer</p>
                    <p className="text-sm text-gray-500">
                      A summary of the overall literature review to get to the answer
                    </p>
                  </CardContent>
                </Card>
                <ul>
                  <li className="m-4 mr-0">
                    <Card>
                      <CardContent className="rounded-md bg-gray-100 p-4">
                        <p className="text-sm font-semibold">Scope of the landscape</p>
                        <p className="text-sm text-gray-500">
                          A summary of the “intake sheet” question asked
                        </p>
                      </CardContent>
                    </Card>
                  </li>
                </ul>
              </li>
              <li className="m-4 mr-0">
                <Card>
                  <CardContent className="rounded-md bg-gray-100 p-4">
                    <p className="text-sm font-semibold">Research approach</p>
                    <p className="text-sm text-gray-500">
                      Details the approach to getting to the answers
                    </p>
                  </CardContent>
                </Card>
              </li>
            </ul>
            <div className="rounded-md bg-gray-100 p-4">
              <p className="text-sm font-semibold">Results</p>
            </div>

            <ul>
              <li className="m-4 mr-0">
                <Card>
                  <CardContent className="rounded-md bg-gray-100 p-4">
                    <p className="text-sm font-semibold">Trends</p>
                    <p className="text-sm text-gray-500">
                      Overview and visualizations of trends over the past 5 to 10 years
                    </p>
                  </CardContent>
                </Card>
              </li>
              <li className="m-4 mr-0">
                <Card>
                  <CardContent className="rounded-md bg-gray-100 p-4">
                    <p className="text-sm font-semibold">Solutions & emerging technologies</p>
                    <p className="text-sm text-gray-500">
                      Tables of the emerging technologies, and innovations and leading te...
                    </p>
                  </CardContent>
                </Card>
              </li>
              <li className="m-4 mr-0">
                <Card>
                  <CardContent className="rounded-md bg-gray-100 p-4">
                    <p className="text-sm font-semibold">Key players</p>
                    <p className="text-sm text-gray-500">
                      Which institutes, universities, and companies are most active in the ...
                    </p>
                  </CardContent>
                </Card>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-start space-x-2">
            <Button className="bg-black text-white" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button>Start Creating</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTechOverviewDialog;
