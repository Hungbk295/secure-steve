import { ReactNode } from "react";
import Sidebar from "@/app/components/sidebar";

interface DefaultLayoutProps {
  children: ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="security-layout flex h-screen bg-gray-50">
      <Sidebar />

      <div className="security-main-content flex-1 flex flex-col overflow-hidden">
        <div className="security-header bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Security Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Monitor and analyze security threats
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <i className="ri-notification-3-line text-xl" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </div>

        <main className="security-page-content flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DefaultLayout;
