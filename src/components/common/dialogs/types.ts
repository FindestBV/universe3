import { ReactNode } from "react";

export type DialogVariant =
  | "share" // ShareObject
  | "connectQuery" // ConnectQuery
  | "addLink" // AddLinkToItem
  | "connectEntity" // ConnectToEntity
  | "lockPage" // LockPageConfirm
  | "createNew"; // FormWizard

// Base form data interfaces
export interface ShareFormData {
  type: "share";
  users: string[];
  shareThisObject: boolean;
  shareLinkedObjects: boolean;
}

export interface LinkFormData {
  type: "addLink" | "connectEntity";
  relationship: string;
  linkName: string;
}

export interface QueryFormData {
  type: "connectQuery";
  relationship: string;
  linkName: string;
  queryString?: string;
  parameters?: string;
}

export interface EntityFormData {
  type: "connectEntity";
  relationship: string;
  linkName: string;
  entityType?: string;
}

export interface LockPageFormData {
  type: "lockPage";
  isLocked: boolean;
  reason?: string;
}

// Union type for all possible form data types
export type DialogFormData =
  | ShareFormData
  | LinkFormData
  | QueryFormData
  | EntityFormData
  | LockPageFormData;

// Base dialog props interface
export interface BaseDialogProps<T extends DialogFormData = DialogFormData> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  variant: DialogVariant;
  title: string;
  parentId?: string;
  parentTitle?: string;
  onConfirm?: (data: T) => void;
  onCancel?: () => void;
  initialData?: T;
  trigger?: ReactNode;
}

// Specific dialog props interfaces
export interface ShareDialogProps extends BaseDialogProps<ShareFormData> {
  variant: "share";
}

export interface LinkDialogProps extends BaseDialogProps<LinkFormData> {
  variant: "addLink";
}

export interface QueryDialogProps extends BaseDialogProps<QueryFormData> {
  variant: "connectQuery";
}

export interface EntityDialogProps extends BaseDialogProps<EntityFormData> {
  variant: "connectEntity";
}

export interface LockPageDialogProps extends BaseDialogProps<LockPageFormData> {
  variant: "lockPage";
}
