import {
  useCreateMaturityRadarMutation,
  useGetMaturityRadarQuery,
} from "@/api/projects/projectsApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

import { useEffect, useRef, useState } from "react";

// Types
type MaturityLevel = {
  radius: number;
  color: string;
  label: string;
};

const MATURITY_LEVELS: MaturityLevel[] = [
  { radius: 80, color: "#4299E1", label: "Deploy" },
  { radius: 160, color: "#63B3ED", label: "Demonstrate" },
  { radius: 240, color: "#90CDF4", label: "Develop" },
  { radius: 320, color: "#BEE3F8", label: "Discover" },
];

export const MaturityRadarComponent = ({ node, updateAttributes }) => {
  const { id = "" } = node.attrs;
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [inputValue, setInputValue] = useState(node.attrs.settings.customText || "");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pathSegments = window.location.pathname.split("/");
  const pageId = pathSegments[pathSegments.length - 1];

  const { data: radarData, isLoading, isError } = useGetMaturityRadarQuery(pageId);
  const [createMaturityRadar, { isLoading: isCreating }] = useCreateMaturityRadarMutation();

  useEffect(() => {
    if (!radarData && !isLoading && !isError) {
      createMaturityRadar(pageId);
    }
  }, [radarData, isLoading, isError, createMaturityRadar, pageId]);

  useEffect(() => {
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      requestAnimationFrame(() => {
        canvas.width = 800;
        canvas.height = 800;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // Draw background
        ctx.fillStyle = "#F7FAFC";
        ctx.beginPath();
        ctx.arc(0, 0, 320, 0, Math.PI * 2);
        ctx.fill();

        drawMaturityLevels(ctx);
        drawGridLines(ctx);
        drawLabels(ctx);

        ctx.restore();
      });
    }, 100);
  }, [node.attrs.settings]);

  function drawMaturityLevels(ctx) {
    // Draw from outside in to layer properly
    [...MATURITY_LEVELS].reverse().forEach((level, index) => {
      // Fill circle
      ctx.beginPath();
      ctx.arc(0, 0, level.radius, 0, Math.PI * 2);
      ctx.fillStyle = level.color;
      ctx.fill();

      // Draw white border
      ctx.beginPath();
      ctx.arc(0, 0, level.radius, 0, Math.PI * 2);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw subtle inner shadow
      ctx.beginPath();
      ctx.arc(0, 0, level.radius - 1, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw center white circle
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawGridLines(ctx) {
    // Draw quadrant lines
    ctx.beginPath();
    ctx.moveTo(-320, 0);
    ctx.lineTo(320, 0);
    ctx.moveTo(0, -320);
    ctx.lineTo(0, 320);
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawLabels(ctx) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "#2D3748";

    MATURITY_LEVELS.forEach((level) => {
      const y = -level.radius + 20;

      // Draw label background
      const textMetrics = ctx.measureText(level.label);
      const padding = 8;
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillRect(-textMetrics.width / 2 - padding, y - 10, textMetrics.width + padding * 2, 20);

      // Draw text
      ctx.fillStyle = "#2D3748";
      ctx.fillText(level.label, 0, y);
    });
  }

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);
  const handleContinue = () => {
    updateAttributes({ settings: { ...node.attrs.settings, customText: inputValue } });
    setIsDialogOpen(false);
  };

  useEffect(() => {
    console.log("radar data", radarData);
  }, []);

  return (
    <NodeViewWrapper className="maturity-radar-component max-width-full">
      <NodeViewContent className="content is-editable" />

      <div className="maturity-radar-container relative w-auto max-w-full overflow-y-scroll">
        <h3>Maturity Radar v2</h3>

        <div className="flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width="800"
            height="800"
            className="mt-4 rounded border border-gray-200"
            style={{ width: "800px", height: "800px" }}
          />
          {isLoading || isCreating ? (
            <p>Loading...</p>
          ) : (
            radarData && <div>{radarData.sourceTitle}</div>
          )}
        </div>

        <pre>
          {node.attrs.settings.customText
            ? node.attrs.settings.customText
            : JSON.stringify(node.attrs.settings, null, 2)}
        </pre>
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
