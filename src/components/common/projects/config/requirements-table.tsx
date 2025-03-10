import { Column, Layer, RequirementsTableProps } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Plus, RefreshCw, Star, X } from "lucide-react";

import React, { useState } from "react";

const RequirementsTable: React.FC<RequirementsTableProps> = ({ isOpen, onClose }) => {
  const [selectedLayer, setSelectedLayer] = useState<string>("Layer 1");
  const [numberedList, setNumberedList] = useState(true);
  const [ratingEnabled, setRatingEnabled] = useState(true);
  const [layers] = useState<Layer[]>([{ id: "1", name: "Layer 1", rating: 5 }]);
  const [columns] = useState<Column[]>([{ id: "1", title: "Column 1" }]);

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
            className="mx-8 flex h-3/4 w-full max-w-full flex-col overflow-hidden rounded-lg bg-white shadow-xl md:flex-row"
          >
            {/* Sidebar */}
            <div className="w-full border-b border-gray-200 bg-gray-50 p-6 md:w-72 md:border-b-0 md:border-r">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-900">Table options</h3>
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

                <div className="space-y-4">
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

                  <div>
                    <label className="text-sm font-medium text-gray-700">Rating enabled:</label>
                    <div className="mt-2 flex gap-2">
                      <ToggleButton active={ratingEnabled} onClick={() => setRatingEnabled(true)}>
                        Yes
                      </ToggleButton>
                      <ToggleButton active={!ratingEnabled} onClick={() => setRatingEnabled(false)}>
                        No
                      </ToggleButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-900">Requirements table</h2>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => {}}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Column
                  </button>
                  <button
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => {}}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </button>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-6">
                <div className="mb-6 rounded-md bg-blue-50 p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium text-blue-900">Information to extract</h4>
                      <p className="text-sm text-blue-700">
                        Instruct IGOR the information to extract in the form of a question.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Layer 1</span>
                    <Star className="h-5 w-5 fill-current text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RequirementsTable;
