import { currentUser } from "@/api/auth/authSlice";
import {
  clearDialogState,
  closeDialog,
  fetchArticlesStart,
  fetchArticlesSuccess,
  minimizeDialog,
  openDialog,
  resetTimer,
  restoreDialog,
  startTimer,
  updateTimer,
} from "@/api/documents/documentSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RootState } from "@/store";
import { Minus } from "lucide-react";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface MinimizableDialogProps {
  currentId: string;
  title: string;
}

const MinimizableDialog = ({ currentId, title }: MinimizableDialogProps) => {
  const dispatch = useDispatch();
  const user = useSelector(currentUser);

  const { isDialogOpen, isMinimized, dialogDocumentId, elapsedTime, articles, loading, queryTime } =
    useSelector((state: RootState) => state.document);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isDialogOpen && loading) {
      dispatch(startTimer());
      interval = setInterval(() => {
        dispatch(updateTimer());
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDialogOpen, loading, dispatch]);

  useEffect(() => {
    if (isDialogOpen && articles?.length === 0) {
      dispatch(fetchArticlesStart());

      setTimeout(() => {
        dispatch(
          fetchArticlesSuccess([
            "Why AI Still Can't Fold a T-Shirt",
            "Debugging JavaScript: The Art of Staring at Code Until it Works",
            "React vs. Vue: The Cage Fight That Never Ends",
            "How I Accidentally Deployed to Production on a Friday",
            "10 Reasons Why Your CSS is Laughing at You",
            "ChatGPT Wrote This Article, and Now I’m Out of a Job",
            "The Ultimate Guide to Writing Bug-Free Code (Spoiler: You Can’t)",
            "How to Fix a Bug by Simply Restarting Your Laptop",
            "The Moment You Realize Your API Call Was Never Made",
          ]),
        );

        // Store elapsed time as queryTime before resetting
        dispatch(resetTimer());
      }, 3500);
    }
  }, [isDialogOpen, dispatch, articles]);

  return (
    <Dialog>
      {/* Dialog Trigger Button */}
      {!isDialogOpen && (
        <DialogTrigger asChild>
          <button onClick={() => dispatch(openDialog({ documentId: currentId }))} className="btn">
            Open Dialog
          </button>
        </DialogTrigger>
      )}

      {/* Normal dialog */}
      {!isMinimized && (
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              dispatch(closeDialog());
            }
          }}
        >
          <DialogContent className="h-auto max-w-3xl overflow-auto rounded-lg bg-white p-6 shadow-lg">
            <DialogHeader>
              <div className="flex justify-between">
                <DialogTitle>
                  {title} (ID: {dialogDocumentId})
                </DialogTitle>
                <div>
                  <button
                    onClick={() => dispatch(minimizeDialog())}
                    className="mr-4 rounded border px-2 py-1 text-sm text-gray-500 hover:bg-gray-200"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              </div>
            </DialogHeader>

            <div>
              {user && `Hi ${user}`}
              {articles.length > 0 ? (
                <p className="font-semibold text-green-600">
                  Your query completed in {queryTime} seconds.
                </p>
              ) : (
                <p>Elapsed Time: {elapsedTime} seconds</p>
              )}

              <div className="mt-4">
                <h2 className="text-lg font-semibold">Articles:</h2>
                {loading ? (
                  <p>Loading articles...</p>
                ) : (
                  <ul className="mt-2 list-disc pl-5">
                    {articles && articles.map((article, index) => <li key={index}>{article}</li>)}
                  </ul>
                )}
              </div>
            </div>

            {/* Control buttons (Next & Clear) */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  dispatch(clearDialogState());
                  dispatch(resetTimer());
                  dispatch(closeDialog());
                }}
                className="rounded border border-gray-400 px-4 py-2 text-gray-600 hover:bg-gray-200"
              >
                Clear
              </button>
              <button
                onClick={() => console.log("Next Clicked")}
                className="rounded border border-blue-500 px-4 py-2 text-blue-600 hover:bg-blue-100"
              >
                Next
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Minimized dialog */}
      {isMinimized && (
        <div
          className="fixed bottom-4 right-4 flex h-12 w-1/4 cursor-pointer items-center justify-between bg-[#006A86] px-4 text-white shadow-lg"
          onClick={() => {
            dispatch(restoreDialog());
            dispatch(openDialog({ documentId: dialogDocumentId || currentId }));
          }}
        >
          <p className="text-sm text-white">
            {dialogDocumentId} - {articles.length > 0 ? "Finished" : elapsedTime}
          </p>
          <button className="text-sm text-white">Restore</button>
        </div>
      )}
    </Dialog>
  );
};

export default MinimizableDialog;
