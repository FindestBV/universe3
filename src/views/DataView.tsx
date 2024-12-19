import DataViewPanel from "@/components/shared/layout/data-view-panel";
import DataViewToolbar from "@/components/shared/utilities/data-view-toolbar";
import { useGetLinkingQuery } from "@/services/activity/activityApi";
import { motion } from "framer-motion";

export const DataView = () => {
  const { data: linkingData } = useGetLinkingQuery();

  return (
    <motion.div
      className="dataView"
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
        <div className="absolute left-5 top-[5em] p-4">
          <ul className="flex flex-col">
            <li className="flex flex-row items-center gap-2 text-sm text-gray-500">
              <span className="blueDot__indicator"></span>Entity
            </li>
            <li className="flex flex-row items-center gap-2 text-sm text-gray-500">
              <span className="purpleDot__indicator"></span>Study
            </li>
          </ul>
        </div>
        <DataViewPanel linkingData={linkingData} />
      </div>
    </motion.div>
  );
};

export default DataView;
