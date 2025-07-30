import { useState } from "react";
import { UserRole } from "@/constants/roleConfig";

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { value: UserRole.USER, label: "User", color: "bg-green-500" },
    { value: UserRole.ADMINISTRATOR, label: "Administrator", color: "bg-blue-500" }
  ];

  const currentRoleInfo = roles.find(role => role.value === currentRole);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-white text-sm font-medium shadow-lg hover:opacity-90 transition-opacity ${currentRoleInfo?.color}`}
        >
          <i className="ri-user-settings-line" />
          <span>Role: {currentRoleInfo?.label}</span>
          <i className={`ri-arrow-down-s-line transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
              Switch Role (Demo)
            </div>
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => {
                  onRoleChange(role.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                  currentRole === role.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${role.color}`} />
                <span className="text-sm">{role.label}</span>
                {currentRole === role.value && (
                  <i className="ri-check-line text-blue-600 ml-auto" />
                )}
              </button>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2 px-3">
              <p className="text-xs text-gray-500">
                This is for demo purposes. In production, roles are determined by authentication.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoleSwitcher;
