/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
    };
    token: string;
}

export interface AuthState {
    user: AuthResponse['user'] | null;
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
    abstract?:string;
  }

// Define interfaces for the API response
export interface SavedDocument {
    linkedCounts: LinkedCounts;
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

export interface ConnectedObject {
    connectedObject: [],
    onRemoveConnectionClickAsync: (connectedObjectToRemove: any) => Promise<void>
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
        id: '',
        title: '',
        type: '',
    },
};




export interface Study {
  id: string, 
  type: string,
  customTypeName?: string,
  conclusion: string,
  status: string,
  studies: [],
  entities?: [],
  dateAdded: Date,
  images: [],
  highlights: [],
  linkedCounts: string
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