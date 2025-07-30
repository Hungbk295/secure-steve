import { ReactNode } from "react";
import Sidebar from "@/app/components/sidebar";
import { TopBar } from "@/app/components/topbar";
import { useScreenTitle } from "@/hooks/useScreenTitle";
import { CURRENT_USER_ROLE } from "@/constants/roleConfig";

interface DefaultLayoutProps {
  children: ReactNode;
  screenTitle?: string; // Optional override
}

function DefaultLayout({ children, screenTitle }: DefaultLayoutProps) {
  const autoScreenTitle = useScreenTitle();
  const finalScreenTitle = screenTitle || autoScreenTitle;
  return (
    <div className="security-layout flex h-screen bg-gray-50">
      <Sidebar />

      <div className="security-main-content flex-1 flex flex-col overflow-hidden">
        <TopBar
          screenTitle={finalScreenTitle}
          alarmCount={5}
          verificationCount={3}
          userInfo={{
            name: "John Doe",
            role: "Administrator",
            department: "IT Security",
          }}
          serverStatus="normal"
          userRole={CURRENT_USER_ROLE}
        />

        <main className="security-page-content flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DefaultLayout;
