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
  linkedObjectCounts: { [key: string]: number };
  id: string;
  title: string;
  url: string;
  type: string;
  dateAdded: string;
}

export interface SavedDocumentResponse {
  [x: string]: any;
  items: SavedDocumentListItem[];
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

export interface ProjectOverview {
  id: string;
  name: string;
  owner: User;
  createdBy: User;
  tabs: Tab[];
  recentPages: RecentPage[];
  projectStructure: GraphNode[];
}

export interface User {
  id: string;
  email: string;
}

export interface Tab {
  id: string;
  name: string;
  content: string;
  type: string;
  order: number;
  isDefault: boolean;
  tabComponent: TabComponent;
}

export interface TabComponent {
  objectId: string;
  type: string;
  content: string;
}

export interface RecentPage {
  id: string;
  title: string;
  changeDate: string; // ISO formatted date string
}

export interface GraphNode {
  id: string;
  name: string;
  type: string;
  customTypeName: string;
  objectType: number;
  dateAdded: string; // ISO formatted date string
  otherUpperLevelNodes: GraphNode[];
  lowerLevelNodes: GraphNode[];
}

export interface BaseListResponse<T> {
  pageItemCount: number;
  isLastPage: boolean;
  totalItemCount: number;
  items: T[];
}

export interface Project {
  id: string;
  name: string;
  visibility: string;
}

// Specific interface for the saved document list item
export interface SavedDocumentListItem {
  id: string;
  title: string;
  url: string;
  savedDocumentType: number;
  objectType: number;
  linkedObjectCounts: LinkedObjectCounts;
  connectedObjects: ConnectedObject[];
  createdByUsername: string;
  dateAdded: string; // ISO formatted date string
}

export interface LinkedObjectCounts {
  documentCount: number;
  entityCount: number;
  studyCount: number;
  projectCount: number;
  highlightCount: number;
  imageCount: number;
  fileCount: number;
  commentCount: number;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  type: string;
}

export interface UpdateProjectRequest {
  name: string;
  description: string;
  type: string;
}

export interface AddSavedSourceRequest {
  sourceId: string;
  type: string;
}

export interface ProjectListResponse extends BaseListResponse<Project> {}

export interface ProjectPagesListResponse extends BaseListResponse<Project> {}

export interface Page {
  id: string;
  title: string;
  customTypeName: string;
  dateAdded: string;
  images: PageImage[];
  highlights: Highlight[];
  savedDocuments: SavedDocument[];
  linkedCounts: LinkedCounts;
  totalDocumentsCount: number;
  createdByUserId: string;
  createdByUsername: string;
  createdOnDate: string;
  linkedFiles: LinkedFile[];
  isConnected: boolean;
  galaxyId: string;
  referencedBy: Reference[];
  isLocked: boolean;
}

export interface PageListItem {
  id: string;
  title: string;
  type: string;
  customTypeName: string;
  dateAdded: string;
  linkedCounts: LinkedCounts;
  createdByUsername: string;
  isConnected: boolean;
}

// Image used on the Page level (includes fileName)
export interface PageImage {
  id: string;
  fileName: string;
  path: string;
  caption: string;
  dateAdded: string;
}

export interface LinkedCounts {
  documentCount: number;
  entityCount: number;
  studyCount: number;
  projectCount: number;
  highlightCount: number;
  imageCount: number;
  fileCount: number;
  commentCount: number;
}

export interface LinkedFile {
  id: string;
  title: string;
  fileExtension: string;
  url: string;
  text: string;
}

export interface Reference {
  id: string;
  type: number;
  title: string;
}

export interface RecentProjectSource {
  id: string;
  title: string;
  url: string;
  savedDocumentType: number;
  objectType: number;
}

export interface RecentProjectPage {
  id: string;
  title: string;
  type: string;
}

export interface RecentProjectActivities {
  recentSavedSources: RecentProjectSource[];
  recentPages: RecentProjectPage[];
}
