export interface SearchResult {
  id: string;
  name: string;
  content: string;
  cosine_similarity: number;
  metadata?: {
    source: string;
    timestamp: string;
    type: "document" | "web" | "database";
    url?: string;
  };
}

export interface SimilarityGroup {
  name: string;
  similarity: {
    from: number;
    to: number;
  };
  results: SearchResult[];
}

export interface RAGResponse {
  groups: SimilarityGroup[];
  totalResults: number;
  searchMetadata: {
    timestamp: string;
    queryVector?: number[];
    processingTime: number;
  };
}

export interface AskIgorProps {
  isToolbar?: boolean;
  iconOnly?: boolean;
  label?: string;
  preloadedQueries?: Array<{
    id: string;
    question: string;
  }>;
  connectedQueries?: Array<{
    id: string;
    question: string;
  }>;
  onRunQuery?: (query: string) => Promise<void>;
  onCancelQuery?: (queryId: string) => void;
}

export interface EditorState {
  content: string;
  isProcessing: boolean;
  error?: string;
}

export interface SearchState {
  isSearching: boolean;
  results?: RAGResponse;
  error?: string;
}
