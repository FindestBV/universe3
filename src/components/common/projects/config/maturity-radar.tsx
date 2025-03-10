import { Column, Layer, RequirementsTableProps } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Star, X } from "lucide-react";

import React, { useState } from "react";

const MaturityRadar: React.FC<ConfigDialogProps> = ({ isOpen, onClose }) => {
  const [selectedLayer, setSelectedLayer] = useState<string>("Layer 1");
  const [numberedList, setNumberedList] = useState(true);
  const [layers] = useState<Layer[]>([{ id: "1", name: "Layer 1" }]);

  const ToggleButton: React.FC<{
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }> = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
        active ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {children}
    </button>
  );

  const maturityLevels = [
    { id: "discover", name: "Discover", color: "bg-blue-100" },
    { id: "develop", name: "Develop", color: "bg-blue-300" },
    { id: "demonstrate", name: "Demonstrate", color: "bg-blue-500" },
    { id: "deploy", name: "Deploy", color: "bg-blue-700" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-white shadow-xl md:flex-row"
          >
            {/* Sidebar */}
            <div className="w-full border-b border-gray-200 bg-gray-50 p-6 md:w-72 md:border-b-0 md:border-r">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-900">Radar options</h3>
                  <div className="relative">
                    <select
                      value={selectedLayer}
                      onChange={(e) => setSelectedLayer(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {layers.map((layer) => (
                        <option key={layer.id} value={layer.name}>
                          {layer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                    <p className="text-sm text-blue-700">
                      Be careful, when changing layers the table resets itself.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Numbered list:</label>
                  <div className="mt-2 flex gap-2">
                    <ToggleButton active={numberedList} onClick={() => setNumberedList(true)}>
                      Yes
                    </ToggleButton>
                    <ToggleButton active={!numberedList} onClick={() => setNumberedList(false)}>
                      No
                    </ToggleButton>
                  </div>
                </div>

                <button className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  INSERT RADAR
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900">Maturity radar</h2>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {maturityLevels.map((level) => (
                      <div
                        key={level.id}
                        className={`rounded-md px-3 py-1 text-sm ${level.color} text-gray-700`}
                      >
                        {level.name}
                      </div>
                    ))}
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-6">
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Layer 1</span>
                  </div>
                  <p className="mt-2 italic text-gray-500">
                    Add a description that explains the context of the radar
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MaturityRadar;
