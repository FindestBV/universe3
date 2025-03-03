import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileQuestion, Link, Lock, Users } from "lucide-react";

import { useState } from "react";

import LinkForm from "./forms/link-form";
import LockPageForm from "./forms/lock-page-form";
import QueryForm from "./forms/query-form";
import ShareForm from "./forms/share-form";
import { BaseDialogProps, DialogFormData } from "./types";

interface ValidationState {
  isValid: boolean;
  errors: Record<string, string>;
}

const GenericDialog = <T extends DialogFormData>({
  isOpen,
  onOpenChange,
  variant,
  title,
  parentId,
  parentTitle,
  onConfirm,
  onCancel,
  initialData,
  trigger,
}: BaseDialogProps<T>) => {
  const [formData, setFormData] = useState<T>((initialData as T) || getInitialData(variant));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const validation = validateForm(formData, variant);
      if (!validation.isValid) {
        setError(Object.values(validation.errors)[0]); // Show first error
        return;
      }

      if (onConfirm) {
        await onConfirm(formData);
      }
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    onCancel?.();
    onOpenChange(false);
  };

  // Render different content based on variant
  const renderContent = () => {
    switch (variant) {
      case "share":
        return <ShareForm data={formData} onChange={(data) => setFormData(data as T)} />;

      case "addLink":
      case "connectEntity":
        return (
          <LinkForm
            data={formData}
            onChange={(data) => setFormData(data as T)}
            parentTitle={parentTitle}
          />
        );

      case "connectQuery":
        return (
          <QueryForm
            data={formData}
            onChange={(data) => setFormData(data as T)}
            parentTitle={parentTitle}
          />
        );

      case "lockPage":
        return <LockPageForm data={formData} onChange={(data) => setFormData(data as T)} />;

      default:
        return <div>Unsupported dialog variant</div>;
    }
  };

  // Default trigger based on variant
  const defaultTrigger = () => {
    switch (variant) {
      case "share":
        return (
          <Button>
            <Users size={16} className="mr-2" />
            SHARE
          </Button>
        );
      case "addLink":
        return (
          <Button variant="ghost" size="icon">
            <Link size={16} />
          </Button>
        );
      case "connectQuery":
        return (
          <Button>
            <FileQuestion size={16} className="mr-2" />
            Connect Query
          </Button>
        );
      case "lockPage":
        return (
          <Button variant="ghost" size="icon">
            <Lock size={16} />
          </Button>
        );
      default:
        return <Button>{title}</Button>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger()}</DialogTrigger>
      <DialogContent className="h-auto max-w-3xl overflow-auto rounded-lg bg-white p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle>
            <h2 className="mb-2 text-lg font-bold">{title}</h2>
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {renderContent()}

        <DialogFooter>
          <div className="flex justify-between gap-4">
            <Button onClick={handleCancel} variant="outline" disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper functions
function getInitialData(variant: string): DialogFormData {
  switch (variant) {
    case "share":
      return {
        type: "share",
        users: [],
        shareThisObject: true,
        shareLinkedObjects: false,
      };
    case "addLink":
    case "connectEntity":
      return {
        type: "addLink",
        relationship: "child",
        linkName: "",
      };
    case "connectQuery":
      return {
        type: "connectQuery",
        relationship: "child",
        linkName: "",
        queryString: "",
        parameters: "",
      };
    case "lockPage":
      return {
        type: "lockPage",
        isLocked: false,
        reason: "",
      };
    default:
      throw new Error(`Unsupported variant: ${variant}`);
  }
}

function validateForm(data: DialogFormData, variant: string): ValidationState {
  const errors: Record<string, string> = {};

  switch (variant) {
    case "share":
      if (!data.users.length) {
        errors.users = "Please add at least one user";
      }
      break;

    case "addLink":
    case "connectEntity":
      if (!data.linkName?.trim()) {
        errors.linkName = "Name is required";
      }
      break;

    case "connectQuery":
      if (!data.linkName?.trim()) {
        errors.linkName = "Name is required";
      }
      if (!data.queryString?.trim()) {
        errors.queryString = "Query is required";
      }
      break;

    case "lockPage":
      if (data.isLocked && !data.reason?.trim()) {
        errors.reason = "Please provide a reason for locking the page";
      }
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export default GenericDialog;
