import { useUser } from "@/store";
import { useState } from "react";
import { useNavigate } from "react-router";

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

  return (
    <form onSubmit={submitLogin}>
      <input
        type="text"
        value={username}
        data-type="username"
        placeholder="请输入用户名..."
        onChange={changeFormInput}
      />
      <input
        type="password"
        value={password}
        data-type="password"
        placeholder="请输入密码..."
        onChange={changeFormInput}
      />
      <button type="submit">登陆</button>
    </form>
  );
}

export default Login;
