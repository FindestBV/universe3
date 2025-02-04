import { currentUser } from "@/api/auth/authSlice";
import DocumentIcon from "@/assets/document.svg";
import EntityIcon from "@/assets/entity.svg";
import QueryIcon from "@/assets/query.svg";
import StudyIcon from "@/assets/study.svg";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRightCircle, Award, Beaker, Rainbow } from "lucide-react";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import UserAvatar from "../utilities/user-avatar";

// Define a type for your items
type CreateItemType = {
  type: string;
  desc: string;
  icon: string;
  queryType?: string;
};

interface CreateQueryDialogProps {
  icon: string; // Name of the icon to render
  queryType: string; // Type of query, e.g., "Study", "Entity", etc.
}

const iconMapping: Record<string, React.ElementType> = {
  Beaker,
  Rainbow,
  Award,
  Document: DocumentIcon,
  Entity: EntityIcon,
  Query: QueryIcon,
  Study: StudyIcon,
};

const CreateQueryDialog: React.FC<CreateQueryDialogProps> = ({ icon, queryType }) => {
  const { t } = useTranslation();
  const user = useSelector(currentUser);
  // Dynamically determine which icon to render
  const IconComponent = iconMapping[icon] || Rainbow; // Fallback to Rainbow if no match

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex w-full cursor-pointer items-center justify-between">
          <IconComponent size={24} />
          <div className="ml-2">Search for {queryType}</div>
          <ArrowRightCircle size={24} className="group-hover:text-blue-300" />
        </div>
      </DialogTrigger>
      <DialogContent
        className="h-[80vh] max-w-6xl overflow-hidden bg-white"
        style={{ maxHeight: "70%", maxWidth: "80%" }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center">
          {/* <UserAvatar username={user ? user : "Ronan"} /> */}
          <div className="flex w-full max-w-lg flex-col gap-6 p-6">
            <div>
              <select
                id="searchFor"
                name="searchFor"
                className="mt-1 block w-full rounded-md border-gray-300 bg-blue-200 p-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Search for {queryType}</option>
                <option value="Option1">Option 1</option>
                <option value="Option2">Option 2</option>
                <option value="Option3">Option 3</option>
              </select>
            </div>

            <h2 className="text-lg font-bold text-gray-900">Name your query</h2>

            <p className="text-sm text-gray-600">
              This is where you can give your query a name. The query name helps you to identify and
              organize it later. Ensure the name is descriptive enough to quickly understand its
              purpose.
            </p>

            <div>
              <input
                type="text"
                placeholder="Query name"
                className="block w-full rounded-md border-gray-400 p-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-start gap-4">
              <button
                type="button"
                className="inline-flex flex-1 justify-center rounded-md border border-transparent bg-[#006A86] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Create Query
              </button>
              <button
                type="button"
                className="flex-2 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQueryDialog;
