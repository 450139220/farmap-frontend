import { Avatar, Button, Layout as LayoutAntd, Menu, Space, theme } from "antd";
import { UserOutlined } from "@ant-design/icons";

import { Outlet, NavLink, useNavigate, useLocation } from "react-router";
import { adminRoutes, expertRoutes, routes } from "@/routes/routes";
import style from "./index.module.css";
import { useUser } from "@/store";
import { useEffect } from "react";

const { Header, Sider, Content } = LayoutAntd;

function Layout() {
    const username = useUser((state) => state.username);
    const role = useUser((state) => state.role);
    const navigate = useNavigate();

    // navigate to login page
    const toLogin = () => {
        navigate("/login");
    };
    const logout = useUser((state) => state.logout);
    const quitLogin = () => {
        // clear current store
        logout();
        // clear permanent store
        localStorage.setItem("user", "");
        // navigate back to /
        navigate("/");
    };

    // sider
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    // router
    const location = useLocation();

    const routesMap = {
        // ???
        guest: routes.map((route) => ({
            key: route.path!,
            label: (
                <NavLink to={route.path!}>
                    <span>{route.handle.name}</span>
                    <i className="ri-arrow-right-up-line"></i>
                </NavLink>
            ),
        })),
        user: routes.map((route) => ({
            key: route.path!,
            label: (
                <NavLink to={route.path!}>
                    <span>{route.handle.name}</span>
                    <i className="ri-arrow-right-up-line"></i>
                </NavLink>
            ),
        })),
        expert: expertRoutes.map((route) => ({
            key: route.path!,
            label: (
                <NavLink to={route.path!}>
                    <span>{route.handle.name}</span>
                    <i className="ri-arrow-right-up-line"></i>
                </NavLink>
            ),
        })),
        admin: adminRoutes.map((route) => ({
            key: route.path!,
            label: (
                <NavLink to={route.path!}>
                    <span>{route.handle.name}</span>
                    <i className="ri-arrow-right-up-line"></i>
                </NavLink>
            ),
        })),
    };
    const menuItems = routesMap[role];
    useEffect(() => {
        if (menuItems && menuItems.length > 0) {
            if (location.pathname !== menuItems[0].key) {
                navigate(menuItems[0].key);
            }
        }
    }, [role]);

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
                    items={menuItems}
                />
            </Sider>
            <LayoutAntd>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Space style={{ display: "flex", justifyContent: "end", marginRight: "24px" }}>
                        {username === "" || username === "guest" ? (
                            <span
                                style={{ cursor: "pointer" }}
                                onClick={toLogin}>
                                未登陆，请点击此处登陆
                            </span>
                        ) : (
                            <div>
                                <span>您好，{username} 用户！</span>
                                <Avatar
                                    size={32}
                                    icon={<UserOutlined />}
                                    style={{ cursor: "pointer" }}
                                />
                                <Button
                                    style={{ marginLeft: "1rem" }}
                                    onClick={quitLogin}>
                                    退出登陆
                                </Button>
                            </div>
                        )}
                    </Space>
                </Header>

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
