import { ReactNode } from "react";
import Sidebar from "@/app/components/sidebar";
import { TopBar } from "@/app/components/topbar";

import { CURRENT_USER_ROLE } from "@/constants/roleConfig";

interface DefaultLayoutProps {
  children: ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div
      className="security-layout flex h-screen"
      style={{ backgroundColor: "var(--color-grey-3)" }}
    >
      <Sidebar />

      <div className="security-main-content flex-1 flex flex-col overflow-hidden">
        <TopBar
          verificationCount={3}
          userInfo={{
            name: "John Doe",
            role: "Administrator",
            department: "IT Security",
          }}
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
