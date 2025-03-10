/* eslint-disable @typescript-eslint/no-explicit-any */
export enum ObjectTypeEnum {
  Unknown = 0,
  Entity = 1,
  Document = 2,
  Highlight = 3,
  Study = 4,
  Image = 5,
  ScienceArticle = 6,
  UsPatent = 7,
  Weblink = 8,
  MagPatent = 9,
  Comment = 10,
  File = 11,
  Tenant = 12,
  Organization = 13,
  Case = 14,
  Query = 15,
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

export interface AuthState {
  user: AuthResponse["user"] | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface User {
  user: string;
  id: string;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: any;
  // password: string;
}

export interface DocumentData {
  abstract?: string;
  id: string;
  title: string;
  name: string;
  type: string;
  dateAdded: string;
}

export interface DocumentListResponse {
  info: {
    count?: number;
    pages?: number;
    next?: string | null;
    prev?: string | null;
  };
  results: Document[];
}

export interface DocumentListResponseListQueryParams {
  id?: number;
  title?: string;
  url?: string;
  type?: string;
  dateAdded?: string;
  abstract?: string;
}

// Define interfaces for the API response
export interface SavedDocument {
  linkedCounts: { [key: string]: number };
  id: string;
  title: string;
  url: string;
  type: string;
  dateAdded: string;
  entities?: [];
  // Add other fields as needed
}

export interface SavedDocumentResponse {
  [x: string]: any;
  documents: SavedDocument[];
  total: number;
}

export interface Draft {
  id?: string;
  type?: string;
  createdAt?: string;
  content?: string;
}

export interface ConnectedObject {
  id: string | null | undefined;
  name: string | React.ReactNode;
  type: string | React.ReactNode;
  connectedObject: any[];
  onRemoveConnectionClickAsync: (connectedObjectToRemove: any) => Promise<void>;
}

// Define interfaces for the entity state
export interface Entity {
  id: string;
  title: string;
  type: string;
  description: string;
  // Add other entity properties as needed
}

export interface EntityData {
  id: string;
  title: string;
  type: string;
  description: string;
  // Add other entity properties as needed
}

export interface EntityState {
  entities: Entity[];
  selectedEntity: Entity | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    id?: string;
    title?: string;
    type?: string;
  };
}

export const initialState: EntityState = {
  entities: [],
  selectedEntity: null,
  isLoading: false,
  error: null,
  filters: {
    id: "",
    title: "",
    type: "",
  },
};

export interface Study {
  id: string;
  type: string;
  customTypeName?: string;
  conclusion: string;
  status: string;
  studies: [];
  entities?: [];
  dateAdded: Date;
  images: [];
  highlights: [];
  linkedCounts: string;
}

export interface StudyState {
  studies: Study[];
  selectedStudy: Study | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    id?: string;
    title?: string;
    type?: string;
  };
}

export type TLinkGraphNodeDTO = {
  id: string;
  name: string;
  type: string;
  customTypeName?: string;
  objectType: ObjectTypeEnum;
  dateAdded: Date;
  lowerLevelNodes: TLinkGraphNodeDTO[];
  otherUpperLevelNodes: TLinkGraphNodeDTO[];
};

export type TTypeGraphNodeDTO = {
  type: string;
  objectType: ObjectTypeEnum;
  children: TLinkGraphNodeDTO[];
};

export interface IPackGraphNode {
  objectType: ObjectTypeEnum;
  group: string;
  id: string;
  index?: number;
  name: string;
  size: number;
  data: {
    size: number;
    text: string;
    objectType: string;
    objectTypeEnum: ObjectTypeEnum;
  };
  type: string;
}

export interface SearchResult {
  name: string;
  content: string;
  cosine_similarity: number;
}

export interface Layer {
  id: string;
  name: string;
  rating?: number;
}

export interface Column {
  id: string;
  title: string;
  width?: number;
}

export interface RequirementsTableProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface MaturityLevel {
  id: string;
  name: string;
  color: string;
}

export type DialogType = "requirements" | "maturity" | "results";
