export interface ChatMessage {
  timestamp: Date;
  author: string;
  message: string;
  wordCount: number;
}

export interface ParsedChatData {
  messages: ChatMessage[];
  users: string[];
  startDate: Date | null;
  endDate: Date | null;
}
