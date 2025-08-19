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

// /command?command=git
export interface CommandRequestQuery {
  command: string;
}

// /usercommand?page=1&order=ASC|DESC
// limit is set by backend so not allow here
export interface UserCommandListRequestQuery {
  page?: number;
  order?: "ASC" | "DESC";
}

// /usercommand/search?args=git+commit
export interface UserCommandSearchRequestQuery {
  args: string;
}
