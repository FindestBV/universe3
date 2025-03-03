import { Label } from "@/components/ui/label";

import { LinkFormData } from "../types";

interface LinkFormProps {
  data: LinkFormData;
  onChange: (data: LinkFormData) => void;
  parentTitle?: string;
}

export const LinkForm: React.FC<LinkFormProps> = ({ data, onChange, parentTitle }) => {
  const handleChange = (field: keyof LinkFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <>
      {parentTitle && (
        <div className="mb-2">
          <Label className="mb-1 block text-sm font-medium text-gray-700">Add link from:</Label>
          <p className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-900">
            {parentTitle}
          </p>
        </div>
      )}
      <div className="mb-2">
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
      <div className="mb-2">
        <Label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="linkName">
          Name:
        </Label>
        <input
          type="text"
          id="linkName"
          value={data.linkName}
          onChange={(e) => handleChange("linkName", e.target.value)}
          className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          placeholder="Enter link name"
        />
      </div>
    </>
  );
};

export default LinkForm;
