export interface ComparisonResultItem {
  term: string;
  score: number;
  reason: string;
}

export interface ComparisonResponse {
  analysis: ComparisonResultItem[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
