import { useLoaderData } from "react-router";
import { Avatar, Button, Layout as LayoutAntd, Menu, Space, theme } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Outlet, NavLink, useNavigate } from "react-router";
import { useUserStore } from "@/store/user";
import { ALL_ROUTES } from "@/routes/routes";
import { useEffect } from "react";

const { Header, Sider, Content } = LayoutAntd;

export default function Layout() {
  // Redirect to login page if token is expired
  const { isExpired } = useLoaderData();
  console.log(isExpired);

  const navigate = useNavigate();
  useEffect(() => {
    if (isExpired) navigate("/login");
  }, []);

  const username = useUserStore((s) => s.username);
  const role = useUserStore((s) => s.role);

  const logout = useUserStore((s) => s.logout);

  // Sider
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  // Router
  type MenuItem = Required<MenuProps>["items"][number];
  const menuItems: MenuItem[] = ALL_ROUTES.filter((r) =>
    r.handle.roles.includes(role),
  ).map((r) => ({
    key: r.handle.key,
    label: <NavLink to={r.path!}>{r.handle.name}</NavLink>,
    icon: <r.handle.Icon />,
  }));
  console.log(menuItems);

  return (
    <LayoutAntd style={{ height: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div
          style={{
            backgroundColor: "#eee",
            textAlign: "center",
            padding: "10px 0",
            margin: "10px 20px",
            fontSize: "1.5rem",
            borderRadius: 8,
            fontWeight: "bold",
          }}>
          FarMap
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <LayoutAntd style={{ height: "100%" }}>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Space
            style={{
              display: "flex",
              justifyContent: "end",
              marginRight: "24px",
            }}>
            <div>
              <span>您好，{username} 用户！</span>
              <Avatar
                size={32}
                icon={<UserOutlined />}
                style={{ cursor: "pointer" }}
              />
              <Button style={{ marginLeft: "1rem" }} onClick={logout}>
                退出登陆
              </Button>
            </div>
          </Space>
        </Header>

        <Content
          style={{
            margin: "0.5rem",
            height: "100%",
          }}>
          <Outlet />
        </Content>
      </LayoutAntd>
    </LayoutAntd>
  );
}
