import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { DEFAULT_LAYOUT, NONE_LAYOUT } from "@/constants/layout";
import ROUTES from "@/constants/routes";
import { ItemRoute } from "@/interfaces/layout";
import DefaultLayout from "@/layouts/DefaultLayout";
import PrivateLayout from "@/layouts/PrivateLayout";

const Login = lazy(() => import("@/app/pages/Login"));
const Detection = lazy(() => import("@/app/pages/Analyze/Detection"));
const Action = lazy(() => import("@/app/pages/Analyze/Action"));
const AssignServers = lazy(
  () => import("@/app/pages/Policy/System/AssignServers")
);
const BlacklistWhitelist = lazy(
  () => import("@/app/pages/Policy/BlacklistWhitelist")
);
const History = lazy(() => import("@/app/pages/History"));
const AILearningHistory = lazy(
  () => import("@/app/pages/History/AILearningHistory")
);
const AdminPolicy = lazy(() => import("@/app/pages/Policy/AdminPolicy"));
const Notifications = lazy(() => import("@/app/pages/Alarm/Notifications"));
const AuthorityHistory = lazy(
  () => import("@/app/pages/History/AuthorityHistory")
);
const AlarmSchedule = lazy(() => import("@/app/pages/Alarm/Schedule"));
const Dashboard = lazy(() => import("@/app/pages/Home/Dashboard"));
const ReportList = lazy(() => import("@/app/pages/Report/List"));
const ReportRegular = lazy(() => import("@/app/pages/Report/Regular"));
const SignUp = lazy(() => import("@/app/pages/Login/SignUpForm"));
const PersonalSettings = lazy(
  () => import("@/app/pages/User/PersonalSettings")
);

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
    components: <Dashboard />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.Home.Dashboard,
    components: <Dashboard />,
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
    components: <Action />,
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
    components: <AssignServers />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.Policy.AdminPolicy,
    components: <AdminPolicy />,
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
    components: <BlacklistWhitelist />,
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
    components: <History />,
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
    components: <AILearningHistory />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.History.Authority,
    components: <AuthorityHistory />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },

  {
    key: ROUTES.AlarmAndReport.Notifications,
    components: <Notifications />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.AlarmAndReport.Schedule,
    components: <AlarmSchedule />,
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
    key: ROUTES.AlarmAndReport.List,
    components: <ReportList />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: ROUTES.AlarmAndReport.Regular,
    components: <ReportRegular />,
    layout: DEFAULT_LAYOUT,
    private: true,
  },

  {
    key: ROUTES.SignIn,
    components: <Login />,
    layout: NONE_LAYOUT,
    private: false,
  },
  {
    key: ROUTES.User.ChangeInfo,
    components: <PersonalSettings />,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
  {
    key: ROUTES.SignUp,
    components: <SignUp />,
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
