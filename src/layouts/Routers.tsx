import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { DEFAULT_LAYOUT, NONE_LAYOUT } from "@/constants/layout";
import URL from "@/constants/url";
import { ItemRoute } from "@/interfaces/layout";
import DefaultLayout from "@/layouts/DefaultLayout";
import PrivateLayout from "@/layouts/PrivateLayout";
import Home from "@/app/pages/Home";

const Login = lazy(() => import("@/app/pages/Login"));
const sharedRouterItems: ItemRoute[] = [];

const sideBarRouter: ItemRoute[] = [
  {
    key: URL.Home,
    components: <Home />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: URL.SignIn,
    components: <Login />,
    layout: NONE_LAYOUT,
    private: false,
  },
];

const menus = [...sharedRouterItems, ...sideBarRouter];

export default function Routers() {
  return (
    <Routes>
      {menus.map((item) => {
        let element = item.components;

        element = (
          <Suspense fallback={<div className="min-h-screen" />}>
            {element}
          </Suspense>
        );

        if (item.layout === DEFAULT_LAYOUT) {
          element = <DefaultLayout>{element}</DefaultLayout>;
        }

        if (item.private) {
          element = <PrivateLayout>{element}</PrivateLayout>;
        }

        return <Route key={item.key} path={item.key} element={element} />;
      })}
    </Routes>
  );
}
