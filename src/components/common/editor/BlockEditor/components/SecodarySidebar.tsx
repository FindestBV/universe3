import { Button } from "@/components/ui/button";

import React from "react";

// Using ShadCN components

export const SecondarySidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <div
      className={`fixed right-0 top-0 h-full w-64 transform bg-gray-100 shadow-md transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      aria-hidden={!isOpen}
    >
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-bold">Secondary Sidebar</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      <div className="p-4">
        <p>Content for the secondary sidebar goes here.</p>
      </div>
    </div>
  );
};

export default SecondarySidebar;
