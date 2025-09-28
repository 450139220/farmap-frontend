import { request } from "./reqeust";

function useToken(): [string, (t: string) => void] {
  const token = localStorage.getItem("token");
  const setToken = (t: string): void => {
    localStorage.setItem("token", t);
  };
  return [token ? token : "", setToken];
}

function validateToken(token: string): Promise<boolean> {
  return new Promise((outerRes, outerRej) => {
    request
      .get<Response>("/user/validate-token", token)
      .then(() => {
        outerRes(true);
      })
      .catch(() => {
        outerRej(false);
      });
  });
}

function usePermanentUser(): [UserState | null, (data: UserState) => void] {
  const getPermanentUser = localStorage.getItem("user");
  let permanentUser: UserState | null = null;
  if (getPermanentUser) {
    permanentUser = JSON.parse(getPermanentUser);
  }

  const setPermanentUser = (data: UserState) => {
    localStorage.setItem("user", JSON.stringify(data));
  };

  return [permanentUser, setPermanentUser];
}

export { useToken, validateToken, usePermanentUser };
