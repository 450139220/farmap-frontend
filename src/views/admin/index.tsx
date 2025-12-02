import { useToken } from "@/utils/permanence";
import { request } from "@/utils/reqeust";
import { Card, Flex, List, Popconfirm, Button, message } from "antd";
import { useEffect, useState } from "react";

import style from "./index.module.css";

export default function AdminPage() {
    const [token, _] = useToken();

    // user management
    const [userLists, setUserLists] = useState<UserList[]>([]);
    const [userErr, setUserErr] = useState<boolean>(false);
    useEffect(() => {
        handleFetchUser();
    }, []);
    // re-fetch the users
    const handleFetchUser = () => {
        request
            .get<{ message: string; users: UserList[] }>("/user/all", token)
            .then((res) => {
                setUserLists(res.users);
                setUserErr(false);
            })
            .catch(() => {
                setUserErr(true);
            });
    };
    // remove user
    const confirmDelete = (name: UserList["name"]) => {
        request
            .delete<DeleteUserResponse, DeleteUserRequest>(
                "/user/delete",
                {
                    targetUser: name,
                },
                token,
            )
            .then(() => {
                message.success("删除成功");
            })
            .catch((e: Error) => {
                message.error("删除失败，请查看控制台。");
                console.log(e);
            });
    };
    return (
        <>
            <Card
                title={
                    <i
                        className="ri-id-card-fill"
                        style={{ color: "var(--primary)" }}>
                        &nbsp;&nbsp;用户管理
                    </i>
                }>
                <Flex className={style.user__container}>
                    <List
                        itemLayout="horizontal"
                        dataSource={userLists}
                        renderItem={(item) => (
                            <List.Item
                                actions={[
                                    <Popconfirm
                                        title="删除该用户"
                                        description={`是否确定删除当前用户${item.name}`}
                                        onConfirm={() => {
                                            confirmDelete(item.name);
                                        }}
                                        okText="确定"
                                        cancelText="取消">
                                        <Button danger>删除用户</Button>
                                    </Popconfirm>,
                                ]}>
                                <List.Item.Meta
                                    title={item.name}
                                    description={`用户ID：${item.id}，权限：${item.role}`}
                                />
                            </List.Item>
                        )}
                    />
                    {userErr && (
                        <div style={{ color: "var(--danger)" }}>
                            用户获取失败，请刷新页面重试。
                        </div>
                    )}
                </Flex>
            </Card>
        </>
    );
}
