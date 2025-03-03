import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Lock, LockOpen } from "lucide-react";

import { useState } from "react";

import { LockPageFormData } from "../types";

interface LockPageFormProps {
  data: LockPageFormData;
  onChange: (data: LockPageFormData) => void;
}

interface ValidationErrors {
  reason?: string;
}

export const LockPageForm: React.FC<LockPageFormProps> = ({ data, onChange }) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = (field: keyof LockPageFormData, value: string): string | undefined => {
    switch (field) {
      case "reason":
        if (data.isLocked && !value.trim()) {
          return "Please provide a reason for locking the page";
        }
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (field: keyof LockPageFormData, value: any) => {
    if (typeof value === "string") {
      const error = validate(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }

    const newData = { ...data, [field]: value };
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {data.isLocked ? (
            <Lock className="h-8 w-8 text-red-600" />
          ) : (
            <LockOpen className="h-8 w-8 text-green-600" />
          )}
          <div>
            <Label htmlFor="isLocked" className="text-lg font-medium">
              Page Status
            </Label>
            <p className="text-sm text-gray-500">
              {data.isLocked ? "Page is currently locked" : "Page is currently unlocked"}
            </p>
          </div>
        </div>
        <Switch
          id="isLocked"
          checked={data.isLocked}
          onCheckedChange={(checked) => handleChange("isLocked", checked)}
        />
      </div>

      {data.isLocked && (
        <div className="space-y-2">
          <Label htmlFor="reason" className="text-sm font-medium">
            Reason for locking
          </Label>
          <Textarea
            id="reason"
            value={data.reason || ""}
            onChange={(e) => handleChange("reason", e.target.value)}
            placeholder="Please provide a reason for locking this page"
            className={`min-h-[100px] ${errors.reason ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}
        </div>
      )}

      <div className="rounded-md bg-gray-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-800">
              {data.isLocked
                ? "What happens when a page is locked?"
                : "What happens when a page is unlocked?"}
            </h3>
            <div className="mt-2 text-sm text-gray-600">
              <p>
                {data.isLocked
                  ? "When a page is locked, other users cannot edit its content. They can still view and comment on the page."
                  : "When a page is unlocked, authorized users can edit, comment, and interact with the page normally."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockPageForm;
