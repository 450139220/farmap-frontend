import type { FarmPreviewType } from "@/store/user";
import { Request, req } from "@/utils/reqeust";
import { Flex, Form, Layout, Input, Card, Button } from "antd";
import type { FormProps } from "antd";
import { useState } from "react";

type UserLoginRequest = {
  username: string;
  password: string;
};
type UserLoginResult = {
  username: string;
  role: string;
  farms: FarmPreviewType[];
};

const { Header, Content } = Layout;

type FieldType = {
  username?: string;
  password?: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
  errorInfo,
) => {};

function Login() {
  // Error message for user
  const [msg, setMsg] = useState<string>("");

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("Success:", values);
    try {
      const resp = await req.post<UserLoginRequest, UserLoginResult>(
        "/user/login",
        {
          username: values.username!,
          password: values.password!,
        },
      );
      // TODO: store this response to user store
      // Reset error message
      setMsg("");
    } catch (e) {
      const msg = Request.getErrorMsg(e);
      setMsg(msg);
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{ color: "#eee", fontSize: "1.8rem", textAlign: "center" }}>
        <span>FarMap 农业数字地图服务平台</span>
      </Header>
      <Content>
        <Flex align="center" justify="center" style={{ height: "100%" }}>
          <Card title="用户登录" variant="borderless" style={{ width: 500 }}>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off">
              <Form.Item<FieldType>
                label="用户名"
                name="username"
                rules={[{ required: true, message: "请输入用户名！" }]}>
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="密码"
                name="password"
                rules={[{ required: true, message: "请输入密码！" }]}>
                <Input.Password />
              </Form.Item>

              <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
            {msg.length !== 0 && (
              <div style={{ textAlign: "center", color: "#dd0000" }}>{msg}</div>
            )}
          </Card>
        </Flex>
      </Content>
    </Layout>
  );
}

export default Login;
