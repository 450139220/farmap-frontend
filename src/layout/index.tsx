import { Layout as LayoutAntd, Menu, theme } from "antd";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router";
import { routes } from "@/routes/routes";
import style from "./index.module.css";
import { useUser } from "@/store";

const { Header, Sider, Content } = LayoutAntd;

function Layout() {
    const username = useUser((state) => state.username);
    const navigate = useNavigate();

    // navigate to login page
    const toLogin = () => {
        navigate("/login");
    };

    // sider
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    // router
    const location = useLocation();

    return (
        <LayoutAntd className={style.layout__container}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0">
                <div className={style.logo}>FarMap</div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={routes.map((route) => ({
                        key: route.path!,
                        label: (
                            <NavLink to={route.path!}>
                                <span>{route.handle.name}</span>
                                <i className="ri-arrow-right-up-line"></i>
                            </NavLink>
                        ),
                    }))}
                />
            </Sider>
            <LayoutAntd>
                <Header style={{ padding: 0, background: colorBgContainer }} />

                <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
                    <div
                        style={{
                            padding: 24,
                            // textAlign: "center",
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}>
                        <Outlet />
                    </div>
                </Content>
                {/* <Footer style={{ textAlign: "center" }}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer> */}
            </LayoutAntd>
        </LayoutAntd>
    );

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
                <div className={style.links}>{}</div>
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
