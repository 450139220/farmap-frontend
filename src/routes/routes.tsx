import type { JSX } from "react";

import { createBrowserRouter } from "react-router";
import type { RouteObject } from "react-router";

import { lazy, Suspense } from "react";
import RouterLoading from "./RouterLoading";

import Layout from "@/layout";

const Dashboard = lazy(() => import("@/views/dashboard"));
const Operations = lazy(() => import("@/views/operations"));

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
  },
  {
    path: "/operations",
    element: withSuspense(Operations),
  },
];

const routesWithLayout: RouteObject[] = [
  {
    path: "/",
    Component: Layout,
    children: routes,
  },
];

export default createBrowserRouter(routesWithLayout);
