import type { UserStoreState } from "@/store/user";
import { req } from "./reqeust";
// 1. enter the web
// 2. validate token
//   2.1. token expired -> navigate to login page
//   2.2. token is valid -> get the permanent user info

// Token operations
function useToken(): string {
  let token = localStorage.getItem("token");
  if (!token) token = "NO_TOKEN_STORED";
  return token;
}
function setToken(token: string): void {
  localStorage.setItem("token", token);
}
async function validateToken(): Promise<boolean> {
  // TODO: record this request interface
  try {
    const resp = await req.get<{ data: { valid: boolean } }>("/validate-token");
    return resp.data.valid;
  } catch {
    return false;
  }
}

// User permanence operations
function useUserStore(): UserStoreState | void {
  const user = localStorage.getItem("user");
  if (!user) return;
  return JSON.parse(user);
}
function setUserStore(user: UserStoreState): void {
  const userStr = JSON.stringify(user);
  localStorage.setItem("user", userStr);
}

export const permanence = {
  token: {
    useToken,
    setToken,
    validateToken,
  },
  user: {
    useUserStore,
    setUserStore,
  },
};
