export interface RegisterUserRequest {
  displayName: string;
  email: string;
  password: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface CreateUsercommandRequest {
  command: string;
  arguments: string;
  note: Record<string, string>;
  tags: string[];
}

export interface CommandRequestQuery {
  command: string;
}

export interface UserCommandListRequestQuery {
  page?: number;
  order?: "ASC" | "DESC";
}

export interface UserCommandSearchRequestQuery {
  args: string;
}
