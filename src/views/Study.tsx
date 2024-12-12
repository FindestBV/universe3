import { useParams, useLocation } from "react-router";
import { renderProseMirrorContent } from "@/lib/renderProseMirror";

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

  return (
    <div className="flex flex-col w-full h-full max-sm:px-4">
      <div className="flex flex-col w-auto h-screen">
        <h1 className="text-xl text-black font-black mb-2">
          {study?.title || "Study"}
        </h1>
        <p>
          <span className="text-black font-black">Study ID:</span> {id}
        </p>
        <p>
          <span className="text-black font-black">Type:</span>{" "}
          Study
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