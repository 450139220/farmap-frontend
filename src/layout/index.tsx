import { Avatar, Button, Layout as LayoutAntd, Menu, Space, theme } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Outlet, NavLink, useNavigate } from "react-router";
import { useUserStore } from "@/store/user";
import { ALL_ROUTES } from "@/routes/routes";

const { Header, Sider, Content } = LayoutAntd;

export default function Layout() {
  const username = useUserStore((s) => s.username);
  const role = useUserStore((s) => s.role);

  const navigate = useNavigate();
  // Navigate to login page
  const toLogin = () => {
    navigate("/login");
  };
  const logout = useUserStore((s) => s.logout);

  // Sider
  const {
    token: { colorBgContainer, borderRadiusLG },
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
  console.log(menuItems);

  return (
    <LayoutAntd>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div>FarMap</div>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={menuItems} />
      </Sider>
      <LayoutAntd>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Space style={{ display: "flex", justifyContent: "end", marginRight: "24px" }}>
            {username === "" || username === "guest" ? (
              <span style={{ cursor: "pointer" }} onClick={toLogin}>
                未登陆，请点击此处登陆
              </span>
            ) : (
              <div>
                <span>您好，{username} 用户！</span>
                <Avatar size={32} icon={<UserOutlined />} style={{ cursor: "pointer" }} />
                <Button style={{ marginLeft: "1rem" }} onClick={logout}>
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
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}>
            <Outlet />
          </div>
        </Content>
      </LayoutAntd>
    </LayoutAntd>
  );
}
