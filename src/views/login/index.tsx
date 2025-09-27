import { useUser } from "@/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import style from "./index.module.css";

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

  // set the user state and navigate back to dashboard
  const login = useUser().login;
  const navigate = useNavigate();
  // submit this form
  const submitLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(username, password);
    login(username, "user");
    navigate("/");
  };

  // TODO: avoid signing repeatedly
  // but here doesn't set states permanently or validate token automatically
  const userStateName = useUser((state) => state.username);
  const [isSigned, setIsSigned] = useState<boolean>(false);
  useEffect(() => {
    console.log(isSigned);

    setIsSigned(!!userStateName);
  }, []);

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
            type="submit">
            登陆
          </button>
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
