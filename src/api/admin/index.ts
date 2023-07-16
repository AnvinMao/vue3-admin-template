import { http } from "@/utils/request";
import { AccountInfo, LoginData, LoginResult } from "./types";

export function adminLogin(data: LoginData) {
  return http.post<LoginResult>("/login", data);
}

export function getAccount() {
  return http.get<AccountInfo>("/account");
}

export function adminLogout() {
  return http.get("/logout");
}
