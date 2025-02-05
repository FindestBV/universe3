import { currentUser } from "@/api/auth/authSlice";
import {
  closeDialog,
  fetchArticlesStart,
  fetchArticlesSuccess,
  minimizeDialog,
  openDialog,
  restoreDialog,
} from "@/api/documents/documentSlice";
import DocumentIcon from "@/assets/document.svg";
import EntityIcon from "@/assets/entity.svg";
import QueryIcon from "@/assets/query.svg";
import StudyIcon from "@/assets/study.svg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RootState } from "@/store";
import { ArrowRightCircle, Award, Beaker, Loader2, Minus, Rainbow } from "lucide-react";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

type CreateQueryDialogProps = {
  id: string;
  icon: string;
  queryType: string;
};

const iconMapping: Record<string, React.ElementType> = {
  Beaker,
  Rainbow,
  Award,
  Document: DocumentIcon,
  Entity: EntityIcon,
  Query: QueryIcon,
  Study: StudyIcon,
};

const CreateQueryDialog: React.FC<CreateQueryDialogProps> = ({ id, icon, queryType }) => {
  const { t } = useTranslation();
  const user = useSelector(currentUser);
  const dispatch = useDispatch();

  const { isDialogOpen, isMinimized, articles, loading } = useSelector(
    (state: RootState) => state.document,
  );
  const [queryName, setQueryName] = useState("");
  const [queryDescription, setQueryDescription] = useState("");
  const [queryValues, setQueryValues] = useState("");
  const [queryCategory, setQueryCategory] = useState("General");
  const [queryTags, setQueryTags] = useState("");
  const [step, setStep] = useState(1);

  const IconComponent = iconMapping[icon] || Rainbow;

  const handleStartQuery = () => {
    if (!queryName.trim() || !queryDescription.trim()) return;
    setStep(2);
  };

  const handleRunQuery = async () => {
    if (!queryValues.trim() || !queryTags.trim()) return;
    dispatch(fetchArticlesStart());
    setStep(3);

    setTimeout(async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await response.json();

        const titles = data.slice(0, 5).map((item: any) => item.title);
        dispatch(fetchArticlesSuccess(titles));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }, 10000);
  };

  useEffect(() => {
    console.log("queryid?", id + " " + queryType);
    if (!isDialogOpen) {
      setQueryName("");
      setQueryDescription("");
      setQueryValues("");
      setQueryCategory("General");
      setQueryTags("");
      setStep(1);
    }
  }, [isDialogOpen]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          onClick={() => dispatch(openDialog({ documentId: queryType }))}
          className="flex w-full cursor-pointer items-center justify-between"
        >
          <IconComponent size={24} />
          <div className="ml-2">Search for {queryType}</div>
          <ArrowRightCircle size={24} className="group-hover:text-blue-300" />
        </div>
      </DialogTrigger>

      {!isMinimized && (
        <Dialog open={isDialogOpen} onOpenChange={(open) => !open && dispatch(closeDialog())}>
          <DialogContent className="h-[75vh] max-w-4xl overflow-hidden bg-white p-4 transition-all duration-300 sm:p-6">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg sm:text-xl">{queryType} Query</DialogTitle>
                <button
                  onClick={() => dispatch(minimizeDialog())}
                  className="rounded border px-2 py-1 text-sm text-gray-500 hover:bg-gray-200"
                >
                  <Minus size={16} />
                </button>
              </div>
            </DialogHeader>

            <div className="flex h-full w-full flex-col items-center justify-start transition-all duration-300">
              {step === 1 ? (
                // Step 1: Query Details
                <div className="flex w-full max-w-lg flex-col gap-4 p-4 sm:p-6">
                  <h2 className="text-lg font-semibold text-gray-900">Step 1: Query Details</h2>
                  <input
                    type="text"
                    value={queryName}
                    onChange={(e) => setQueryName(e.target.value)}
                    placeholder="Query Name"
                    className="block w-full rounded-md border-gray-300 p-2"
                  />
                  <textarea
                    value={queryDescription}
                    onChange={(e) => setQueryDescription(e.target.value)}
                    placeholder="Query Description"
                    className="block w-full rounded-md border-gray-300 p-2"
                  />
                  <button
                    onClick={handleStartQuery}
                    className="rounded-md bg-[#006A86] px-4 py-2 text-sm text-white"
                  >
                    Next
                  </button>
                </div>
              ) : step === 2 ? (
                // Step 2: Query Parameters
                <div className="flex w-full max-w-lg flex-col gap-4 p-4 sm:p-6">
                  <h2 className="text-lg font-semibold text-gray-900">Step 2: Query Parameters</h2>
                  <select
                    value={queryCategory}
                    onChange={(e) => setQueryCategory(e.target.value)}
                    className="block w-full rounded-md border-gray-300 p-2"
                  >
                    <option>General</option>
                    <option>Science</option>
                    <option>Technology</option>
                    <option>Health</option>
                  </select>
                  <input
                    type="text"
                    value={queryValues}
                    onChange={(e) => setQueryValues(e.target.value)}
                    placeholder="Enter search values"
                    className="block w-full rounded-md border-gray-300 p-2"
                  />
                  <input
                    type="text"
                    value={queryTags}
                    onChange={(e) => setQueryTags(e.target.value)}
                    placeholder="Enter tags (comma-separated)"
                    className="block w-full rounded-md border-gray-300 p-2"
                  />
                  <div className="flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="rounded-md bg-gray-400 px-4 py-2 text-sm text-white"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleRunQuery}
                      className="rounded-md bg-[#006A86] px-4 py-2 text-sm text-white"
                    >
                      Run Query
                    </button>
                  </div>
                </div>
              ) : (
                // Step 3: Loading & Results
                <div className="flex w-full max-w-lg flex-col gap-4 p-4 sm:p-6">
                  <h2 className="text-center text-lg font-semibold text-gray-900">
                    Query Results for "{queryName}"
                  </h2>
                  {loading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="animate-spin text-gray-500" size={32} />
                      <p className="text-gray-600">Fetching results... Please wait.</p>
                    </div>
                  ) : (
                    <>
                      <ul className="list-disc pl-5">
                        {articles.map((title, index) => (
                          <li key={index} className="text-gray-700">
                            {title}
                          </li>
                        ))}
                      </ul>
                      <div className="flex w-full items-center gap-2">
                        <button
                          onClick={() => dispatch(closeDialog())}
                          className="rounded-md bg-gray-400 px-4 py-2 text-sm text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => dispatch(closeDialog())}
                          className="rounded-md bg-green-600 px-4 py-2 text-sm text-white"
                        >
                          Store Query
                        </button>
                        <button
                          onClick={() => dispatch(closeDialog())}
                          className="rounded-md bg-yellow-600 px-4 py-2 text-sm text-white"
                        >
                          Re-Run Query
                        </button>
                        <button
                          onClick={() => dispatch(closeDialog())}
                          className="rounded-md bg-red-600 px-4 py-2 text-sm text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {isMinimized && (
        <div
          className="fixed bottom-4 right-4 flex h-12 w-64 cursor-pointer items-center justify-between bg-[#006A86] px-4 text-white shadow-lg"
          onClick={() => dispatch(restoreDialog())}
        >
          <p className="text-sm text-white">
            {loading ? "Running Query..." : `${queryName} - Minimized`}
          </p>
          <button className="text-sm text-white">Restore</button>
        </div>
      )}
    </Dialog>
  );
};

export default CreateQueryDialog;
