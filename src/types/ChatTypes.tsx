export interface Repository {
  id: string;
  name: string;
  language: string;
  stars: number;
  forks: number;
  description: string;
  isPrivate: boolean;
}

export interface CodeSection {
  code: string;
  language?: string;
}

export type MessageRole = "user" | "assistant";
export type MessageType =
  | "repository-list"
  | "repository-detail"
  | "code-response"
  | "error";

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
  type?: MessageType;
  repositoryList?: Repository[];
  repositoryName?: string;
  codeSections?: CodeSection[];
}
