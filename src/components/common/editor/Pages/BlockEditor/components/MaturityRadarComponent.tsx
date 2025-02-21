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

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

type MaturityRadarProps = {
  node?: any;
  updateAttributes?: (attrs: any) => void;
};

export const MaturityRadarComponent: React.FC<MaturityRadarProps> = ({
  node,
  updateAttributes,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasDrawnRef = useRef(false); // Prevent unnecessary re-draws

  const pathSegments = window.location.pathname.split("/");
  const pageId = pathSegments[pathSegments.length - 1];

  const { data: radarData, isLoading, isError } = useGetMaturityRadarQuery(pageId);
  const [createMaturityRadar, { isLoading: isCreating }] = useCreateMaturityRadarMutation();

  // Ensure the radar data is created if missing
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

        // Draw assessments if we have data
        if (radarData?.data.assessments) {
          drawAssessments(ctx, radarData?.data.assessments);
        }

        ctx.restore();
      });
    }, 100);
  }, [node]);

  function drawMaturityLevels(ctx) {
    // Draw from outside in to layer properly
    [...MATURITY_LEVELS].reverse().forEach((level) => {
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

  function calculateAssessmentPosition(assessment: Assessment) {
    // Calculate average score for positioning
    const avgScore = (assessment.lowScore + assessment.highScore) / 2;

    // Calculate angle based on the assessment index
    const angle = Math.PI * 2 * Math.random(); // Random angle for now

    // Calculate radius based on score (assuming max score is 20)
    const maxScore = 20;
    const radius = (avgScore / maxScore) * 320;

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      radius: 6, // Size of the assessment dot
    };
  }

  function drawAssessments(ctx: CanvasRenderingContext2D, assessments: Assessment[]) {
    assessments.forEach((assessment) => {
      const position = calculateAssessmentPosition(assessment);

      // Draw connecting line
      ctx.beginPath();
      ctx.moveTo(0, -320); // Start from top
      ctx.lineTo(position.x, position.y);
      ctx.strokeStyle = "#4A5568";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw assessment dot
      ctx.beginPath();
      ctx.arc(position.x, position.y, position.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#4A5568";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.font = "12px Arial";
      ctx.fillStyle = "#2D3748";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      // Truncate long titles
      const maxLength = 20;
      const displayTitle =
        assessment.targetTitle.length > maxLength
          ? assessment.targetTitle.substring(0, maxLength) + "..."
          : assessment.targetTitle;

      // Add background to text for better readability
      const textMetrics = ctx.measureText(displayTitle);
      const padding = 4;
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillRect(position.x + 10, position.y - 8, textMetrics.width + padding * 2, 16);

      ctx.fillStyle = "#2D3748";
      ctx.fillText(displayTitle, position.x + 12, position.y);
    });
  }

  const handleOpenDialog = useCallback(() => setIsDialogOpen(true), []);
  const handleCloseDialog = useCallback(() => setIsDialogOpen(false), []);

  const handleContinue = useCallback(() => {
    updateAttributes?.({ settings: { ...node.attrs.settings, customText: inputValue } });
    setIsDialogOpen(false);
  }, [inputValue, node.attrs.settings, updateAttributes]);

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const MemoizedContent = useMemo(
    () => (
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

        <pre>{node.attrs.settings.customText || JSON.stringify(node.attrs.settings, null, 2)}</pre>
        <Button onClick={handleOpenDialog}>Edit Settings</Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Edit Maturity Radar Settings</DialogTitle>
            </DialogHeader>
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter custom text"
              className="bg-[#fcfafc]"
            />
            <DialogFooter>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button onClick={handleContinue}>Continue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    ),
    [isDialogOpen, inputValue, radarData, isLoading, isCreating],
  );

  if (node) {
    return (
      <NodeViewWrapper className="maturity-radar-component max-width-full">
        {MemoizedContent}
      </NodeViewWrapper>
    );
  }
};

export default MaturityRadarComponent;
