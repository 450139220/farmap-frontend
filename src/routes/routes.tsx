import type { JSX } from "react";

import { createBrowserRouter } from "react-router";
import type { RouteObject } from "react-router";

import { lazy, Suspense } from "react";
import RouterLoading from "./RouterLoading";

import Layout from "@/layout";

// login page
const Login = lazy(() => import("@/views/login"));

// common pages
const Dashboard = lazy(() => import("@/views/dashboard"));
const Operations = lazy(() => import("@/views/operations"));
const Weather = lazy(() => import("@/views/weather"));
const Statistic = lazy(() => import("@/views/statistic"));

function withSuspense(Compoennt: React.LazyExoticComponent<() => JSX.Element>): JSX.Element {
  return (
    <Suspense fallback={<RouterLoading />}>
      <Compoennt />
    </Suspense>
  );
}

const routes: RouteObject[] = [
  {
    path: "/",
    element: withSuspense(Dashboard),
    handle: {
      name: "数字地图",
      key: 1,
    },
  },
  {
    path: "/operations",
    element: withSuspense(Operations),
    handle: {
      name: "操作指导",
      key: 2,
    },
  },
  {
    path: "/weather",
    element: withSuspense(Weather),
    handle: {
      name: "天气物候",
      key: 3,
    },
  },
  {
    path: "/statistic",
    element: withSuspense(Statistic),
    handle: {
      name: "统计数据",
      key: 4,
    },
  },
];

const routesWithLayout: RouteObject[] = [
  {
    path: "/",
    Component: Layout,
    children: routes,
  },
  {
    path: "/login",
    element: withSuspense(Login),
  },
];

export default createBrowserRouter(routesWithLayout);
export { routes };
