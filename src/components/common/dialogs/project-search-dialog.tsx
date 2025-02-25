/**
 * ProjectSearchDialog Component
 *
 * This component provides a **modal-based interface** for **searching and exploring projects**.
 * It allows users to initiate a project search and visualize key project-related insights.
 *
 * ## Features:
 * - **Dialog-based project search** with structured content sections.
 * - **Dynamic search initiation** triggered by a button.
 * - **Predefined research categories** (Trends, Emerging Technologies, Key Players).
 * - **Structured landscape overview** to help users navigate project results.
 *
 * ## Customization:
 * - **Modify the default dialog title** using the `dialogTitle` prop.
 * - **Update the research structure** in the provided content sections.
 * - **Extend search parameters** by integrating filters and inputs.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.dialogTitle="Default title"] - Title of the search dialog.
 *
 * @example
 * <ProjectSearchDialog dialogTitle="Search Research Projects" />
 *
 * @dependencies
 * - **ShadCN UI Components**: Dialog, DialogTrigger, DialogContent, DialogTitle, Button, Card.
 * - **Lucide Icons**: ChevronRight.
 * - **React Hooks**: `useState` for managing dialog state.
 *
 * @returns {JSX.Element} The rendered ProjectSearchDialog component.
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronRight } from "lucide-react";

import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ProjectSearchDialog = ({ dialogTitle }: string) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // console.log("props", dialogTitle);

  return (
    <div className="projectSearchDialog">
      {/* Trigger Button */}
      <Button onClick={() => setIsDialogOpen(true)} className="trigger group">
        <div className="flex items-start gap-4">
          <div className="text-left">
            <h3 className="font-medium group-hover:text-white">
              {dialogTitle ? dialogTitle : "Default title"}
            </h3>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 group-hover:text-white" />
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
};

export default ProjectSearchDialog;
