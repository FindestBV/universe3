import {
  useCreateMaturityRadarMutation,
  useGetMaturityRadarQuery,
} from "@/api/projects/projectApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NodeViewWrapper } from "@tiptap/react";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Types
type MaturityLevel = {
  radius: number;
  color: string;
  label: string;
};

type Assessment = {
  id: string;
  targetTitle: string;
  lowScore: number;
  highScore: number;
  index: number;
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
  const [showNumbers, setShowNumbers] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [shouldRenderGraph, setShouldRenderGraph] = useState(false);

  const pathSegments = window.location.pathname.split("/");
  const pageId = pathSegments[pathSegments.length - 1];

  const {
    data: radarData,
    isLoading,
    isError,
  } = useGetMaturityRadarQuery(pageId, {
    refetchOnMountOrArgChange: true,
  });
  const [createMaturityRadar] = useCreateMaturityRadarMutation();

  // Initialize radar data if missing
  useEffect(() => {
    const initializeRadar = async () => {
      if (!isLoading && !isError && (!radarData || !radarData.data) && !isInitialized) {
        try {
          await createMaturityRadar(pageId).unwrap();
          setIsInitialized(true);
        } catch (error) {
          console.error("Failed to initialize radar:", error);
        }
      }
    };

    initializeRadar();
  }, [radarData, isLoading, isError, createMaturityRadar, pageId, isInitialized]);

  const drawRadar = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !shouldRenderGraph) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset canvas dimensions
    canvas.width = 800;
    canvas.height = 800;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Draw maturity levels bar at the top
    const barWidth = 400;
    const barHeight = 40;
    const barX = canvas.width - barWidth - 20;
    const barY = 20;
    const levelWidth = barWidth / 4;

    // Draw the levels
    MATURITY_LEVELS.forEach((level, index) => {
      ctx.fillStyle = level.color;
      ctx.fillRect(barX + index * levelWidth, barY, levelWidth, barHeight);

      ctx.fillStyle = "#2D3748";
      ctx.font = "14px Inter, system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(level.label, barX + index * levelWidth + levelWidth / 2, barY + barHeight / 2);
    });

    // Translate to center for radar
    ctx.translate(canvas.width / 2, canvas.height / 2 + 30);

    // Draw background
    ctx.fillStyle = "#F7FAFC";
    ctx.beginPath();
    ctx.arc(0, 0, 320, 0, Math.PI * 2);
    ctx.fill();

    // Draw maturity levels
    [...MATURITY_LEVELS].reverse().forEach((level) => {
      ctx.beginPath();
      ctx.arc(0, 0, level.radius, 0, Math.PI * 2);
      ctx.fillStyle = level.color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, level.radius, 0, Math.PI * 2);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, level.radius - 1, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw grid lines
    ctx.beginPath();
    ctx.moveTo(-320, 0);
    ctx.lineTo(320, 0);
    ctx.moveTo(0, -320);
    ctx.lineTo(0, 320);
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw assessments
    const assessments = radarData?.assessments;
    if (assessments && Array.isArray(assessments) && assessments.length > 0) {
      assessments.forEach((assessment: Assessment, index: number) => {
        const angle = (index / assessments.length) * Math.PI * 2 - Math.PI / 2;
        const avgScore = (assessment.lowScore + assessment.highScore) / 2;
        const radius = (avgScore / 20) * 320;

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        // Draw connecting line from center
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x, y);
        ctx.strokeStyle = "rgba(74, 85, 104, 0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw assessment dot
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#4A5568";
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw label with line
        const labelRadius = radius + 60;
        const labelX = Math.cos(angle) * labelRadius;
        const labelY = Math.sin(angle) * labelRadius;

        // Draw line to label
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(labelX, labelY);
        ctx.strokeStyle = "rgba(74, 85, 104, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw label
        ctx.font = "14px Inter, system-ui, -apple-system, sans-serif";
        ctx.fillStyle = "#2D3748";

        const isRightSide = Math.cos(angle) > 0;
        ctx.textAlign = isRightSide ? "left" : "right";

        // Draw index number if enabled
        if (showNumbers) {
          const indexText = `${index + 1}.`;
          const indexWidth = ctx.measureText(indexText).width;
          const indexX = isRightSide ? labelX - indexWidth - 8 : labelX + 8;
          ctx.fillText(indexText, indexX, labelY);
        }

        // Draw title
        const titleX = isRightSide ? labelX + 8 : labelX - 8;
        ctx.fillText(assessment.targetTitle, titleX, labelY);
      });
    }

    ctx.restore();
  }, [radarData, showNumbers, shouldRenderGraph]);

  // Redraw whenever data changes
  useEffect(() => {
    if (radarData && shouldRenderGraph) {
      requestAnimationFrame(() => {
        drawRadar();
      });
    }
  }, [radarData, drawRadar, shouldRenderGraph]);

  const handleOpenDialog = useCallback(() => setIsDialogOpen(true), []);
  const handleCloseDialog = useCallback(() => setIsDialogOpen(false), []);

  const handleContinue = useCallback(() => {
    updateAttributes?.({ settings: { ...node?.attrs?.settings, customText: inputValue } });
    setIsDialogOpen(false);
    setShouldRenderGraph(true);
  }, [inputValue, node?.attrs?.settings, updateAttributes]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const MemoizedContent = useMemo(
    () => (
      <div className="maturity-radar-container relative w-auto max-w-full overflow-y-scroll">
        <h3>Maturity Radar v2</h3>
        <div className="flex flex-col items-center">
          {shouldRenderGraph && (
            <canvas
              ref={canvasRef}
              width="800"
              height="800"
              className="mt-4 rounded border border-gray-200"
              style={{ width: "800px", height: "800px" }}
            />
          )}
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Error loading radar data</p>
          ) : !radarData?.data ? (
            <p>{radarData?.sourceTitle}</p>
          ) : (
            <div>{radarData.sourceTitle}</div>
          )}
        </div>

        <pre>
          {node?.attrs?.settings?.customText || JSON.stringify(node?.attrs?.settings, null, 2)}
        </pre>
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
    [
      isDialogOpen,
      inputValue,
      radarData,
      isLoading,
      isError,
      node,
      handleOpenDialog,
      handleCloseDialog,
      handleContinue,
      handleInputChange,
      shouldRenderGraph,
    ],
  );

  return node ? (
    <NodeViewWrapper className="maturity-radar-component max-width-full">
      {MemoizedContent}
    </NodeViewWrapper>
  ) : null;
};

export default MaturityRadarComponent;
