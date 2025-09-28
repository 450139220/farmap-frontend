import { useUser } from "@/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import style from "./index.module.css";

import { request, handleError } from "@/utils/reqeust";
import { usePermanentUser, useToken } from "@/utils/permanence";

export type UserResult = {
  code: number;
  data: {
    farms: FarmState[];
    status: number;
    token: string;
    user: Omit<UserState, "farms" | "username"> & { name: string };
  };
  msg: string | null;
};
function Login() {
  // the part of username and password form
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // handle both input events
  const changeFormInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const type = target.getAttribute("data-type");

    const value = target.value;
    if (type === "username") {
      setUsername(value);
    } else if (type === "password") {
      setPassword(value);
    }
  };

  // validate login status
  const [responseWrong, setResponseWrong] = useState<"" | "internal" | "other">("");

  // set the user state and navigate back to dashboard
  const login = useUser().login;
  const navigate = useNavigate();
  // submit this form
  const submitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    if (isSigning) return;
    e.preventDefault();
    setIsSigning(true);

    // set new token after login manually
    const [_1, setToken] = useToken();
    // and set the user data permanently
    const [_2, setPermanenetUser] = usePermanentUser();

    // request for login
    try {
      const res = await request.post<UserResult, { username: string; password: string }>(
        "/user/login",
        {
          username,
          password,
        },
      );

      // set the global states about login
      const handledData: UserState = {
        username: res.data.user.name,
        role: res.data.user.role,
        farms: res.data.farms,
        // <currentFarmId> may be undefined if the user don't have any farm
        currentFarmId: res.data.farms[0]?.id,
      };
      setPermanenetUser(handledData);
      setToken(res.data.token);
      navigate("/");
    } catch (err) {
      // validate response status and show different informations
      handleError(
        err,
        "500",
        () => {
          setResponseWrong("internal");
        },
        () => {
          setResponseWrong("other");
        },
      );
    }

    setIsSigning(false);
  };

  // TODO: avoid signing repeatedly
  // but here doesn't set states permanently or validate token automatically
  const userStateName = useUser((state) => state.username);
  const [isSigned, setIsSigned] = useState<boolean>(false);
  useEffect(() => {
    setIsSigned(!!userStateName);
  }, []);

  // validate if is signing
  const [isSigning, setIsSigning] = useState<boolean>(false);

  return (
    <div className={style.container}>
      <header>
        <div className={style.logo}>
          <img
            className={style.logo__icon}
            // src=""
            alt="logo"
          />
          <span>FarMap 数字地图</span>
        </div>
      </header>
      {isSigned ? (
        <div>{userStateName}，您已登陆，请退出后重新登陆。</div>
      ) : (
        <form
          className={style.form}
          onSubmit={submitLogin}>
          <label className={style.form__label}>
            <span>用户名：</span>
            <input
              className={style.form__input}
              type="text"
              value={username}
              maxLength={10}
              data-type="username"
              placeholder="请输入用户名..."
              onChange={changeFormInput}
            />
          </label>
          <label className={style.form__label}>
            <span>密码：</span>
            <input
              className={style.form__input}
              type="password"
              value={password}
              maxLength={20}
              data-type="password"
              placeholder="请输入密码..."
              onChange={changeFormInput}
            />
          </label>
          <button
            className={style.form__button}
            type="submit"
            disabled={isSigning}>
            登陆
          </button>
          {
            <div className={style.login__tip}>
              <div
                className={`${style.login__circle} ${
                  isSigning ? style["login__circle-active"] : ""
                }`}></div>
              {responseWrong &&
                (responseWrong === "internal"
                  ? "请检查用户名密码或网络情况。"
                  : "服务器出错，请练习管理员！")}
            </div>
          }
        </form>
      )}
      <div className={style.background}>
        <div className={style.background__front}></div>
        <div className={style.background__back}></div>
      </div>
    </div>
  );
}

export default Login;
