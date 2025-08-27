export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const AUTH_REGISTER_POST = "/api/auth/register";
export const AUTH_LOGIN_POST = "/api/auth/login";
export const AUTH_LOGOUT_POST = "/api/auth/logout";
export const AUTH_REFRESH_TOKEN_POST = "/api/auth/refresh-token";

export const APP_STATUS_GET = "/";

export const COMMAND_SEARCH_GET = "/api/command/search";

export const USER_COMMAND_CREATE_POST = "/api/usercommand";
export const USER_COMMAND_LIST_GET = "/api/usercommand";
export const USER_COMMAND_SEARCH_GET = "/api/usercommand/search";
export const USER_COMMAND_SEARCH_BY_TAGS = "/api/usercommand/search/tags";
export const USER_COMMAND_EDIT_PUT = "/api/usercommand";
export const USER_COMMAND_FAVOURITE_POST = "/api/usercommand/favourite";

export const AUTH_ENDPOINTS = {
  REGISTER: AUTH_REGISTER_POST,
  LOGIN: AUTH_LOGIN_POST,
  LOGOUT: AUTH_LOGOUT_POST,
  REFRESH_TOKEN: AUTH_REFRESH_TOKEN_POST,
} as const;

export const COMMAND_ENDPOINTS = {
  SEARCH: COMMAND_SEARCH_GET,
} as const;

export const USER_COMMAND_ENDPOINTS = {
  CREATE: USER_COMMAND_CREATE_POST,
  LIST: USER_COMMAND_LIST_GET,
  SEARCH: USER_COMMAND_SEARCH_GET,
  SEARCH_BY_TAGS: USER_COMMAND_SEARCH_BY_TAGS,
  EDIT: USER_COMMAND_EDIT_PUT,
  FAVOURITE: USER_COMMAND_FAVOURITE_POST,
} as const;

export const APP_ENDPOINTS = {
  STATUS: APP_STATUS_GET,
} as const;

export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  COMMAND: COMMAND_ENDPOINTS,
  USER_COMMAND: USER_COMMAND_ENDPOINTS,
  APP: APP_ENDPOINTS,
} as const;
