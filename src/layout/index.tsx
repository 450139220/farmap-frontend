import { Outlet, NavLink, useNavigate } from "react-router";
import { routes } from "@/routes/routes";
import style from "./index.module.css";
import { useUser } from "@/store";

function Layout() {
  const username = useUser((state) => state.username);
  const navigate = useNavigate();

  // navigate to login page
  const toLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <header>
        <div className={style.logo}>
          <img
            className={style.logo__icon}
            // src=""
            alt="logo"
          />
          <span>FarMap</span>
        </div>
        <div className={style.links}>
          {routes.map((route) => (
            <NavLink
              className={({ isActive }) => `${style.link} ${isActive ? style["link-active"] : ""}`}
              key={route.handle.key}
              to={route.path!}>
              <span>&nbsp;{route.handle.name}&nbsp;</span>
              <i className="ri-arrow-right-up-line"></i>
            </NavLink>
          ))}
        </div>
        <div className={style.login}>
          {username ? (
            <span>
              您好，<span className={style["login-success"]}>{username}</span>！
            </span>
          ) : (
            <span onClick={toLogin}>
              请点此<span className={style["login-warning"]}>登陆</span>！
            </span>
          )}
          <img
            className={style.logo__icon}
            // src=""
            alt="avatar"
          />
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
