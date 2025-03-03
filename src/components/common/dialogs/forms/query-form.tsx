import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useState } from "react";

import { QueryFormData } from "../types";

interface QueryFormProps {
  data: QueryFormData;
  onChange: (data: QueryFormData) => void;
  parentTitle?: string;
}

interface ValidationErrors {
  queryString?: string;
  linkName?: string;
}

export const QueryForm: React.FC<QueryFormProps> = ({ data, onChange, parentTitle }) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = (field: keyof QueryFormData, value: string): string | undefined => {
    switch (field) {
      case "queryString":
        if (!value.trim()) return "Query string is required";
        if (value.length < 10) return "Query string must be at least 10 characters";
        return undefined;
      case "linkName":
        if (!value.trim()) return "Name is required";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (field: keyof QueryFormData, value: string) => {
    const error = validate(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));

    const newData = { ...data, [field]: value };
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      {parentTitle && (
        <div className="mb-2">
          <Label className="mb-1 block text-sm font-medium text-gray-700">Connect query to:</Label>
          <p className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-900">
            {parentTitle}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="relationship">
          Select relationship:
        </Label>
        <select
          id="relationship"
          value={data.relationship}
          onChange={(e) => handleChange("relationship", e.target.value)}
          className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        >
          <option value="child">is a child of</option>
          <option value="related">is related to</option>
          <option value="reference">references</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="linkName">
          Name:
        </Label>
        <input
          type="text"
          id="linkName"
          value={data.linkName}
          onChange={(e) => handleChange("linkName", e.target.value)}
          className={`block w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-opacity-50 ${
            errors.linkName ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter link name"
        />
        {errors.linkName && <p className="text-sm text-red-500">{errors.linkName}</p>}
      </div>

      <div className="space-y-2">
        <Label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="queryString">
          Query:
        </Label>
        <Textarea
          id="queryString"
          value={data.queryString || ""}
          onChange={(e) => handleChange("queryString", e.target.value)}
          className={`min-h-[100px] ${errors.queryString ? "border-red-500" : "border-gray-300"}`}
          placeholder="Enter your query"
        />
        {errors.queryString && <p className="text-sm text-red-500">{errors.queryString}</p>}
      </div>

      <div className="space-y-2">
        <Label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="parameters">
          Parameters (optional):
        </Label>
        <input
          type="text"
          id="parameters"
          value={data.parameters || ""}
          onChange={(e) => handleChange("parameters", e.target.value)}
          className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          placeholder="Enter parameters (comma-separated)"
        />
      </div>
    </div>
  );
};

export default QueryForm;
