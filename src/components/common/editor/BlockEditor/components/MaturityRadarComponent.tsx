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

  console.log("pageId for maturity query", pageId);

  const { data: radarData, isLoading, isError } = useGetMaturityRadarQuery(pageId);
  const [createMaturityRadar, { isLoading: isCreating }] = useCreateMaturityRadarMutation();

  useEffect(() => {
    if (!radarData && !isLoading && !isError) {
      console.log("No maturity radar found, creating one...");
      createMaturityRadar(pageId);
    }
  }, [radarData, isLoading, isError, createMaturityRadar, pageId]);

  useEffect(() => {
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        console.error("❌ No canvas element found");
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("❌ No canvas context found");
        return;
      }

      console.log("✅ Canvas found, starting render");

      requestAnimationFrame(() => {
        canvas.width = 800;
        canvas.height = 800;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save(); // Save state before translation
        ctx.translate(canvas.width / 2, canvas.height / 2);

        drawMaturityLevels(ctx);
        drawLabels(ctx);

        ctx.restore(); // Restore to prevent cumulative translation
        console.log("✅ Canvas render complete");
      });
    }, 100); // Delay to ensure canvas exists
  }, [node.attrs.settings]);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);
  const handleContinue = () => {
    updateAttributes({ settings: { ...node.attrs.settings, customText: inputValue } });
    setIsDialogOpen(false);
  };

  function drawMaturityLevels(ctx) {
    console.log("🎯 Drawing maturity levels...");
    MATURITY_LEVELS.forEach((level) => {
      ctx.beginPath();
      ctx.arc(0, 0, level.radius, 0, Math.PI * 2);
      ctx.fillStyle = level.color;
      ctx.fill();
      console.log(`✅ Drew circle: ${level.label}, Radius: ${level.radius}, Color: ${level.color}`);

      ctx.beginPath();
      ctx.arc(0, 0, level.radius, 0, Math.PI * 2);
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw center white circle
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
  }

  function drawLabels(ctx) {
    console.log("🔠 Drawing labels...");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "16px Arial";
    ctx.fillStyle = "#2D3748";

    MATURITY_LEVELS.forEach((level) => {
      const y = -level.radius + 20;
      ctx.fillText(level.label, 0, y);
      console.log(`✅ Drew label: ${level.label}, Position: (0, ${y})`);
    });
  }

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
