import { renderProseMirrorContent } from "@/lib/renderProseMirror";

import { useEffect } from "react";
import { useLocation, useParams } from "react-router";

export const Study: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const study = location.state;

  // Parse description
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let parsedDescription: any = null;
  if (study?.description) {
    try {
      parsedDescription = JSON.parse(study.description);
      console.log("Parsed description:", parsedDescription);
    } catch (error) {
      console.error("Failed to parse description:", error);
    }
  }

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="flex h-full w-full flex-col p-12 max-sm:px-4">
      <div className="flex h-screen w-auto flex-col">
        <h1 className="mb-2 text-xl font-black text-black">{study?.title || "Study"}</h1>
        <p>
          <span className="font-black text-black">Study ID:</span> {id}
        </p>
        <p>
          <span className="font-black text-black">Type:</span> Study
        </p>
        <br />
        <div className="text-black">
          {parsedDescription
            ? renderProseMirrorContent(parsedDescription)
            : "No description available."}
        </div>
      </div>
    </div>
  );
};

export default Study;
