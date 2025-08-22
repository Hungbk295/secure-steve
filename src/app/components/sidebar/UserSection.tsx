import { useAppDispatch, useAppSelector } from "@/store";
import { actionLogout, selectInfoLogin } from "@/store/authSlide";
import { notify } from "@/utils/appStateHandle";
import { ENotificationType, EModalMode } from "@/interfaces/app";
import { useNavigate } from "react-router-dom";

interface SecurityUserSectionProps {
  isCollapsed?: boolean;
}

function SecurityUserSection({
  isCollapsed = false,
}: SecurityUserSectionProps) {
  const dispatch = useAppDispatch();
  const infoLogin = useAppSelector(selectInfoLogin);
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
