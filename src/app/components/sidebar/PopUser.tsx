import { useAppDispatch } from "@/store";
import { actionLogout, selectInfoLogin } from "@/store/authSlide";
import { useNavigate } from "react-router-dom";
import URL from "@/constants/url";
import { notify } from "@/utils/appStateHandle";
import { useAppSelector } from "@/store";

function PopUser(props: { onClose: () => void }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const infoLogin = useAppSelector(selectInfoLogin);
  const { onClose } = props;

  return (
    <div className="flex flex-col gap-3">
      <div
        className="text-grey-80 py-1 font-medium text-sm cursor-pointer leading-[29px] hover:!bg-grey-5 rounded"
        onClick={() => navigate(URL.PersonalSettings)}
      >
        <span>Personal Settings</span>
      </div>
      <div
        className="text-grey-80 py-1 font-medium text-sm cursor-pointer leading-[29px] hover:!bg-grey-5 rounded"
        onClick={() => {
          onClose();
          notify({
            message: "Would you like to sign out?",
            okText: "Yes",
            cancelText: "No",
            onOk: () => {
              dispatch(
                actionLogout({
                  userRole: infoLogin.role,
                  accessToken: infoLogin.accessToken,
                })
              );
            },
          });
        }}
      >
        <span>Log out</span>
      </div>
    </div>
  );
}

export default PopUser;
