export interface User {
  id: number;
  displayName: string;
  email: string;
  role: "owner" | "helper" | "viewer";
}

export interface Command {
  id?: number; // dont use id
  command: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface UserCommand {
  id: number;
  commandId: number;
  userId: number;
  arguments: string;
  note: Record<string, string>;
  createdAt: string;
  tags: Tag[];
}
