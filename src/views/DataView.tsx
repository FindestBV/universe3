import DataViewPanel from "@/components/shared/layout/data-view-panel";
import { Button } from "@/components/ui/button";
import { useGetLinkingQuery } from "@/services/activity/activityApi";
import { motion } from "framer-motion";

import { useNavigate } from "react-router";

export const DataView = () => {
  const navigate = useNavigate();
  const { data: linkingData } = useGetLinkingQuery();

  return (
    <motion.div
      className="dataView flex h-screen w-full items-center justify-center bg-white text-slate-400"
      initial={{ opacity: 0 }} // Slide in from the right
      animate={{ opacity: 1 }} // Animate to final position
      exit={{ opacity: 0 }} // Slide out to the right
      transition={{
        duration: 0.35, // Duration in seconds
        ease: "easeInOut", // Smoother easing
      }}
    >
      <div className="text-center">
        <DataViewPanel linkingData={linkingData} />
        <div className="mt-4">
          <Button
            onClick={() => navigate(-1)}
            className="bg-blue-500 uppercase text-white hover:bg-blue-600"
          >
            Go back
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DataView;
