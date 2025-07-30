import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { actionLogout, selectInfoLogin } from "@/store/authSlide";
import { notify } from "@/utils/appStateHandle";
import { ENotificationType, EModalMode } from "@/interfaces/app";

interface UserMenuProps {
  userInfo: {
    name: string;
    role: string;
    department: string;
  };
  onClose: () => void;
}

function UserMenu({ userInfo, onClose }: UserMenuProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const infoLogin = useAppSelector(selectInfoLogin);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleLogout = () => {
    onClose();
    notify({
      message: "Are you sure you want to log out?",
      type: ENotificationType.WARNING,
      mode: EModalMode.SINGLE,
      okText: "Yes, Log out",
      cancelText: "Cancel",
      onOk: () => {
        dispatch(
          actionLogout({
            userRole: infoLogin.role,
            accessToken: infoLogin.accessToken,
          })
        );
      },
    });
  };

  const handleProfileClick = () => {
    onClose();
    console.log("Navigate to profile page");
  };

  const handleChangePassword = () => {
    onClose();
    console.log("Open change password modal");
  };

  const handleSettings = () => {
    onClose();
    console.log("Navigate to settings page");
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {userInfo.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{userInfo.name}</div>
            <div className="text-sm text-gray-500">{userInfo.role}</div>
            <div className="text-xs text-gray-400">{userInfo.department}</div>
          </div>
        </div>
      </div>

      <div className="py-2">
        <button
          onClick={handleProfileClick}
          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <i className="ri-user-line mr-3 text-gray-400" />
          View Profile
        </button>

        <button
          onClick={handleChangePassword}
          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <i className="ri-lock-password-line mr-3 text-gray-400" />
          Change Password
        </button>

        <button
          onClick={handleSettings}
          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <i className="ri-settings-3-line mr-3 text-gray-400" />
          Settings
        </button>

        <div className="border-t border-gray-200 my-2"></div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <i className="ri-logout-box-line mr-3" />
          Log Out
        </button>
      </div>
    </div>
  );
}

export default UserMenu;
