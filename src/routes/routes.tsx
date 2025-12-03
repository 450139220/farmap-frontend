import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import type { RouteObject } from "react-router";
import {
  AlertOutlined,
  AuditOutlined,
  CloudOutlined,
  CompassOutlined,
  DashboardOutlined,
  SlidersOutlined,
} from "@ant-design/icons";

import Layout from "@/layout";
import { req } from "@/utils/reqeust";

export const ALL_ROUTES: RouteObject[] = [
  {
    index: true,
    Component: lazy(() => import("@/views/dashboard")),
    handle: {
      key: 1,
      name: "数字地图",
      Icon: CompassOutlined,
      roles: ["guest", "user", "admin"],
    },
  },
  {
    path: "operations",
    Component: lazy(() => import("@/views/operations")),
    handle: {
      key: 2,
      name: "操作指导",
      Icon: AlertOutlined,
      roles: ["guest", "user", "admin"],
    },
  },
  {
    path: "weather",
    Component: lazy(() => import("@/views/weather")),
    handle: {
      key: 3,
      name: "天气物候",
      Icon: CloudOutlined,
      roles: ["guest", "user", "admin"],
    },
  },
  {
    path: "statistic",
    Component: lazy(() => import("@/views/statistic")),
    handle: {
      key: 4,
      name: "统计数据",
      Icon: SlidersOutlined,
      roles: ["guest", "user", "admin"],
    },
  },

  {
    path: "expert",
    Component: lazy(() => import("@/views/expert")),
    handle: {
      key: 5,
      name: "专家打标",
      Icon: AuditOutlined,
      roles: ["admin", "expert"],
    },
  },
  {
    path: "admin",
    Component: lazy(() => import("@/views/admin")),
    handle: {
      key: 6,
      name: "用户管理",
      Icon: DashboardOutlined,
      roles: ["admin"],
    },
  },
];

const routes: RouteObject[] = [
  {
    path: "/",
    Component: Layout,
    children: ALL_ROUTES,
    loader: async () => {
      // TODO: update the response type
      try {
        const resp = await req.get<{ isExpired: boolean }>(
          "/user/validate-token",
        );
        return resp;
      } catch {
        return {
          isExpired: false,
        };
      }
    },
  },
  {
    path: "/login",
    Component: lazy(() => import("@/views/login")),
  },
  {
    path: "/*",
    Component: lazy(() => import("@/layout/NotFound")),
  },
];

export default createBrowserRouter(routes);
