import { useGetMaturityRadarQuery } from "@/api/projects/projectsApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Node } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

import { useEffect, useState } from "react";

export const MaturityRadarComponent = ({ node, updateAttributes }) => {
  const { id = "" } = node.attrs;
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [inputValue, setInputValue] = useState(node.attrs.settings.customText || "");

  const pathSegments = window.location.pathname.split("/");
  const pageId = pathSegments[pathSegments.length - 1];

  console.log("pageId for maturity query", pageId);
  const radarData = useGetMaturityRadarQuery(pageId);

  console.log("id should be the same as in URL", id);
  console.log("maturity radar data", radarData);

  useEffect(() => {
    console.log("block mounted");
  }, []);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleContinue = () => {
    updateAttributes({ settings: { ...node.attrs.settings, customText: inputValue } });
    setIsDialogOpen(false);
  };

  return (
    <NodeViewWrapper className="maturity-radar-component max-width-full">
      <NodeViewContent className="content is-editable" />

      <div className="martity-radar-container relative w-auto max-w-full overflow-y-scroll">
        <h3>Maturity Radar v2 initial</h3>
        {radarData ? (
          radarData?.data?.sourceTitle
        ) : (
          <pre>
            {node.attrs.settings.customText
              ? node.attrs.settings.customText
              : JSON.stringify(node.attrs.settings, null, 2)}
          </pre>
        )}
        <pre>{node.attrs.settings.customText ? node.attrs.settings.customText : null}</pre>
        <Button onClick={handleOpenDialog}>Edit Settings</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Edit Maturity Radar Settings</DialogTitle>
          </DialogHeader>
          <div>
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter custom text"
              className="bg-[#fcfafc]"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleCloseDialog}>Close</Button>
            <Button onClick={handleContinue}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </NodeViewWrapper>
  );
};

export default MaturityRadarComponent;
