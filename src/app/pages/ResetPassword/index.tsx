import AlbusLogoLogin from "@/assets/svgs/albus-logo-login.svg";
import { Form } from "antd";
import CustomButton from "@/app/components/common/Button";
import {
  DynamicKeyObject,
  EInitialYn,
  EModalMode,
  ENotificationType,
  EUserRole,
} from "@/interfaces/app";
import AlbusCover from "../Login/AlbusCover";
import { useQueryParams } from "@/hooks/useQueryParams";
import { notify, pageLoading } from "@/utils/appStateHandle";
import CustomInputPassword from "@/app/components/common/CustomInputPassword";
import request from "@/utils/request";
import { PASSWORD_RULE_REGEX } from "@/constants/app";
import URL from "@/constants/url";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { actionLogout, selectInfoLogin } from "@/store/authSlide";
import { useAppDispatch } from "@/store";

function ResetPassword() {
  const params = useQueryParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const infoLogin = useSelector(selectInfoLogin);
  const tempPassword = Form.useWatch("tempPassword", form);
  const newPassword = Form.useWatch("newPassword", form);
  const confirmPassword = Form.useWatch("confirmPassword", form);

  const submitForm = (values: DynamicKeyObject) => {
    pageLoading.on();
    const url =
      params.initialYn === EInitialYn.Y
        ? `/auth/forcechange/account/${params.usertype}`
        : `/auth/reset/account/${params.usertype}/confirm`;
    const payload = {
      username: params.username,
      passtoken: values.tempPassword,
      newpassword: values.newPassword,
    };
    request({
      url,
      method: "POST",
      data: payload,
    })
      .then(() => {
        notify({
          message: "Your password has been successfully changed.",
          type: ENotificationType.SUCCESS,
          mode: EModalMode.SINGLE,
          onClose: () => {
            if (infoLogin.accessToken) {
              dispatch(
                actionLogout({
                  userRole: infoLogin.role,
                  accessToken: infoLogin.accessToken,
                })
              );
            }
            navigate(
              params.usertype === EUserRole.MASTER
                ? URL.SignInMaster
                : URL.SignIn
            );
          },
        });
      })
      .finally(() => pageLoading.off());
  };

  return (
    <div className="flex items-center h-screen">
      <AlbusCover />
      <div className="flex-1">
        <div className="w-[400px] mx-auto flex flex-col gap-8 items-center">
          <AlbusLogoLogin />
          <Form
            form={form}
            layout="vertical"
            onFinish={submitForm}
            className="w-full flex flex-col gap-6"
          >
            <Form.Item label="Temporary Password" name="tempPassword">
              <CustomInputPassword placeholder="Enter the temporary password you received." />
            </Form.Item>
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                {
                  pattern: PASSWORD_RULE_REGEX,
                  message:
                    "Include uppercase, lowercase, number, and special character — 8 to 64 characters long.",
                },
              ]}
            >
              <CustomInputPassword placeholder="Enter your new password." />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                {
                  validator: (_, value) =>
                    !value || newPassword === value
                      ? Promise.resolve()
                      : Promise.reject(new Error("Password does not match.")),
                },
              ]}
            >
              <CustomInputPassword placeholder="Enter your new password again." />
            </Form.Item>
            <div>
              <CustomButton
                className="w-full"
                htmlType="submit"
                disabled={!tempPassword || !newPassword || !confirmPassword}
              >
                Reset Password
              </CustomButton>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
