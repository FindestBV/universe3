import { ConfigDialogProps, Layer } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Star, X } from "lucide-react";

import React, { useState } from "react";

const ResultsOverview: React.FC<ConfigDialogProps> = ({ isOpen, onClose }) => {
  const [layerCount, setLayerCount] = useState(1);
  const [numberedList, setNumberedList] = useState(true);
  const [ratingEnabled, setRatingEnabled] = useState(true);

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
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Number of layers:</span>
                    <div className="flex items-center">
                      <button
                        onClick={() => setLayerCount(Math.max(1, layerCount - 1))}
                        className="rounded-l border border-gray-300 p-1 hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="border-b border-t border-gray-300 px-4 py-1">
                        {layerCount}
                      </span>
                      <button
                        onClick={() => setLayerCount(layerCount + 1)}
                        className="rounded-r border border-gray-300 p-1 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
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

                <button className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  INSERT TABLE
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900">Results Overview</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-6">
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Layer 1</span>
                    <div className="flex items-center gap-1">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <Star className="h-5 w-5 text-gray-400" />
                    </div>
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

export default ResultsOverview;
