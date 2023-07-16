export interface LoginData {
  account: string;
  password: string;
}

export interface LoginResult {
  token: string;
}

export interface AccountInfo {
  id: number;
  account: string;
  role: string;
}
