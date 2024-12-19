import DataViewPanel from "@/components/shared/layout/data-view-panel";
import DataViewToolbar from "@/components/shared/utilities/data-view-toolbar";
import { useGetLinkingQuery } from "@/services/activity/activityApi";
import { motion } from "framer-motion";

export const DataView = () => {
  const { data: linkingData } = useGetLinkingQuery();

  return (
    <motion.div
      className="dataView relative flex h-full w-full items-center justify-center bg-white text-slate-400"
      initial={{ opacity: 0 }} // Slide in from the right
      animate={{ opacity: 1 }} // Animate to final position
      exit={{ opacity: 0 }} // Slide out to the right
      transition={{
        duration: 0.35, // Duration in seconds
        ease: "easeInOut", // Smoother easing
      }}
    >
      <DataViewToolbar />

      <div className="text-center">
        <DataViewPanel linkingData={linkingData} />
      </div>
    </motion.div>
  );
};

export default DataView;
