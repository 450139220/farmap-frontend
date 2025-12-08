import { useUserStore, type FarmPreviewType, type UserStoreState } from "@/store/user";
import { permanence } from "@/utils/permanence";
import { req } from "@/utils/reqeust";
import { Flex, Form, Layout, Input, Card, Button } from "antd";
import type { FormProps } from "antd";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

type UserLoginRequest = {
  username: string;
  password: string;
};
type UserLoginResult = {
  data: {
    user: {
      name: string;
      role: UserStoreState["role"];
    };
    farms: FarmPreviewType[];
    token: string;
  };
};

const { Header, Content } = Layout;

type LoginType = {
  username?: string;
  password?: string;
};

function Login() {
  // Enter the home page when token is valid
  const login = useUserStore((s) => s.login);
  const navigate = useNavigate();

  // Permanence
  const setToken = permanence.token.setToken;
  const setUserStore = permanence.user.setUserStore;

  // Loading
  const [loading, setLoading] = useState(false);

  // Error message for user
  const [msg, setMsg] = useState<string>("");

  const onFinish: FormProps<LoginType>["onFinish"] = async (values) => {
    try {
      setLoading(true);
      const resp = await req.post<UserLoginRequest, UserLoginResult>("/user/login", {
        username: values.username!,
        password: values.password!,
      });
      // Store this response to user store
      const userStore: UserStoreState = {
        username: resp.data.user.name,
        role: resp.data.user.role,
        farms: resp.data.farms,
      };
      login(userStore);
      // Store in local storage
      setToken(resp.data.token);
      setUserStore(userStore);

      navigate("/");

      // Reset error message
      setMsg("");
    } catch {
      // const msg = Request.getErrorMsg(e);
      setMsg("用户或密码错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ color: "#eee", textAlign: "center" }} className="resp-login__header">
        <span>FarMap 农业数字地图服务平台</span>
      </Header>
      <Content>
        <Flex align="center" justify="center" style={{ height: "100%" }}>
          <Card title="用户登录" variant="borderless" className="resp-login__panel">
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              onFinish={onFinish}
              autoComplete="off">
              <Form.Item<LoginType>
                label="用户名"
                name="username"
                rules={[{ required: true, message: "请输入用户名！" }]}>
                <Input />
              </Form.Item>

              <Form.Item<LoginType>
                label="密码"
                name="password"
                rules={[{ required: true, message: "请输入密码！" }]}>
                <Input.Password />
              </Form.Item>

              <Form.Item label={null}>
                <Flex gap="0.5rem" align="center">
                  <Button type="primary" htmlType="submit" disabled={loading}>
                    登录
                  </Button>
                  {loading && <Loader2 className="w-6 h-6 ml-2 text-blue-500 animate-spin" />}
                </Flex>
              </Form.Item>
            </Form>
            {msg.length !== 0 && <div style={{ textAlign: "center", color: "#dd0000" }}>{msg}</div>}
          </Card>
        </Flex>
      </Content>
    </Layout>
  );
}

export default Login;
