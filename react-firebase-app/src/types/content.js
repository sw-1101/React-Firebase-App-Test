// コンテンツ関連の型定義
export interface ProcessedContent {
  id: string;
  timestamp: Date;
  originalText?: string;
  processedText: string;
  files: Array<{
    name: string;
    type: string;
    size: number;
    uri?: string;
  }>;
  audioTranscript?: string;
  summary: string;
  tags: string[];
  category: string;
}