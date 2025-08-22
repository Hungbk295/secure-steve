import { useAppDispatch, useAppSelector } from "@/store";
import { actionLogout, selectInfoLogin, selectCurrentUser, selectUserRole } from "@/store/authSlide";
import { notify } from "@/utils/appStateHandle";
import { ENotificationType, EModalMode } from "@/interfaces/app";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/constants/roleConfig";

interface SecurityUserSectionProps {
  isCollapsed?: boolean;
}

const getRoleBadgeStyle = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMINISTRATOR:
      return "bg-red-100 text-red-800";
    case UserRole.SECURITY_OPERATOR:
      return "bg-orange-100 text-orange-800";
    case UserRole.USER:
    default:
      return "bg-blue-100 text-blue-800";
  }
};

const getRoleDisplayName = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMINISTRATOR:
      return "관리자";
    case UserRole.SECURITY_OPERATOR:
      return "보안담당자";
    case UserRole.USER:
    default:
      return "일반사용자";
  }
};

function SecurityUserSection({
  isCollapsed = false,
}: SecurityUserSectionProps) {
  const dispatch = useAppDispatch();
  const infoLogin = useAppSelector(selectInfoLogin);
  const currentUser = useAppSelector(selectCurrentUser);
  const userRole = useAppSelector(selectUserRole);
  const navigate = useNavigate();

  const handleLogout = () => {
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
        ).finally(() => {
          navigate("/sign-in");
        });
      },
    });
  };

  return (
    <div className="security-user-section border-t border-gray-200 p-4">
      {!isCollapsed && currentUser && (
        <div className="mb-4 space-y-2">
          {/* User Info */}
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <i className="ri-user-line text-gray-600 text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser.department}
              </p>
            </div>
            </div>
          </div>
          
          {/* Role Badge */}
          <div className="flex justify-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeStyle(userRole)}`}>
              <i className="ri-shield-user-line mr-1" />
              {getRoleDisplayName(userRole)}
            </span>
          </div>
          
          {/* User Email */}
          <div className="text-center">
            <p className="text-xs text-gray-500 truncate" title={currentUser.email}>
              {currentUser.email}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 bg-[#1c925f] hover:bg-[#1c925f]"
        title="Log out"
      >
        <i className="ri-logout-box-line mr-2" />
        {!isCollapsed ? "Log out" : ""}
      </button>
    </div>
  );
}

export default SecurityUserSection;
