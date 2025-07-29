import CustomButton from "@/app/components/common/Button";
import UserInfo from "@/app/pages/PersonalSettings/UserInfo";
import { useAppDispatch, useAppSelector } from "@/store";
import { actionToggleChangePasswordModal } from "@/store/appSlide";
import { selectInfoLogin } from "@/store/authSlide";
import IconLock from "@/assets/svgs/lock.svg";

function PersonalSettings() {
  const dispatch = useAppDispatch();
  const infoLogin = useAppSelector(selectInfoLogin);

  const handleOpenChangePasswordModal = () => {
    dispatch(
      actionToggleChangePasswordModal({
        isOpen: true,
        role: infoLogin.role,
        username: infoLogin.email,
        accessToken: infoLogin.accessToken,
      })
    );
  };

  return (
    <>
      <div className="flex justify-between">
        <h1 className="font-bold text-2xl text-grey-80 leading-custom-normal">
          Personal settings
        </h1>
        <CustomButton type="primary" disabled>
          Save changes
        </CustomButton>
      </div>
      <div className="mt-4 bg-white pt-4 px-6 pb-8 rounded-lg border border-grey-10">
        <UserInfo />
        <CustomButton
          className="mt-6 !text-xs !h-[26px] !py-1 !px-2"
          theme="black"
          variant="outlined"
          onClick={handleOpenChangePasswordModal}
        >
          <div className="flex items-center gap-1">
            Change Password <IconLock className="w-3 h-3" />
          </div>
        </CustomButton>
      </div>
    </>
  );
}

export default PersonalSettings;
