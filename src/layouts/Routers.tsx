import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { DEFAULT_LAYOUT, NONE_LAYOUT } from "@/constants/layout";
import ROUTES from "@/constants/routes";
import { ItemRoute } from "@/interfaces/layout";
import DefaultLayout from "@/layouts/DefaultLayout";
import PrivateLayout from "@/layouts/PrivateLayout";

const Login = lazy(() => import("@/app/pages/Login"));
const Detection = lazy(() => import("@/app/pages/Detection"));

const PlaceholderPage = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Page Under Development
      </h2>
      <p className="text-gray-500">This page will be implemented soon.</p>
    </div>
  </div>
);

const securityRoutes: ItemRoute[] = [
  {
    key: ROUTES.Home.Index,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.Home.Dashboard,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.Analysis.Detection,
    components: <Detection />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.Analysis.Action,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.Analysis.Requests,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.Analysis.RequestDetail,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.Analysis.Pending,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.Analysis.Completed,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.Policy.SystemSettings,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.Policy.AdminPolicy,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.Policy.UserPolicy,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.Policy.BlacklistWhitelist,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },

  {
    key: ROUTES.History.BlacklistWhitelist,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.History.Inspection,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.History.Action,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.History.PolicyChanges,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.History.AiLearning,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.History.Authority,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },

  {
    key: ROUTES.Alarm.Notifications,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.Alarm.Schedule,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },

  {
    key: ROUTES.User.ChangeInfo,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.User.Permissions,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.Report.List,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.Report.Regular,
    components: <PlaceholderPage />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },

  {
    key: ROUTES.SignIn,
    components: <Login />,
    layout: NONE_LAYOUT,
    private: false,
  },
];

const menus = securityRoutes;

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
