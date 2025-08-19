export interface User {
  id: number;
  displayName: string;
  email: string;
  role: "owner" | "helper" | "viewer";
}

export interface Command {
  id?: number; // dont use id
  command: string;
  similarity?: number;
}

export interface Tag {
  id: number;
  name: string;
}

export interface UserCommand {
  id: number;
  userId: number;
  arguments: string;
  note: Record<string, string>;
  createdAt: string;
  command: Command;
  tags: Tag[];
}
