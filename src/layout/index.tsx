import { useLoaderData } from "react-router";
import { Avatar, Button, Layout as LayoutAntd, Menu, Space, theme } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Outlet, NavLink, useNavigate } from "react-router";
import { useUserStore } from "@/store/user";
import { ALL_ROUTES } from "@/routes/routes";
import { useEffect } from "react";
import { permanence } from "@/utils/permanence";

const { Header, Sider, Content } = LayoutAntd;

export default function Layout() {
  // Redirect to login page if token is expired
  const { isExpired } = useLoaderData();
  const localUserStore = permanence.user.useUserStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (isExpired || !localUserStore) navigate("/login");
  }, []);

  // Use local storage if the token is valid
  const username = localUserStore!.username;
  const role = localUserStore!.role;

  // Log out
  const logout = useUserStore((s) => s.logout);
  const setToken = permanence.token.setToken;
  const handleLogout = () => {
    logout();
    setToken("NO_TOKEN_STORED");
    navigate("/login");
  };

  // Sider
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  // Router
  type MenuItem = Required<MenuProps>["items"][number];
  const menuItems: MenuItem[] = ALL_ROUTES.filter((r) => r.handle.roles.includes(role)).map(
    (r) => ({
      key: r.handle.key,
      label: <NavLink to={r.path!}>{r.handle.name}</NavLink>,
      icon: <r.handle.Icon />,
    }),
  );

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
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={menuItems} />
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
              <Avatar size={32} icon={<UserOutlined />} style={{ cursor: "pointer" }} />
              <Button style={{ marginLeft: "1rem" }} onClick={handleLogout}>
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
