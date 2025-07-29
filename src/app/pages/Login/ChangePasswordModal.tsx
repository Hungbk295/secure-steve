import {
  actionToggleChangePasswordModal,
  selectChangePasswordModal,
} from "@/store/appSlide";
import CustomModal from "../../components/common/CustomModal";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/store";
import { Button, Form } from "antd";
import { notify, pageLoading } from "@/utils/appStateHandle";
import CustomInputPassword from "@/app/components/common/CustomInputPassword";
import { EModalMode, ENotificationType, EUserRole } from "@/interfaces/app";
import request from "@/utils/request";
import { PASSWORD_RULE_REGEX } from "@/constants/app";
import { getValidatedAntdFormValues } from "@/utils/app";

function CustomNotification() {
  const dispatch = useAppDispatch();
  const { isOpen, role, username, accessToken } = useSelector(
    selectChangePasswordModal
  );
  const [form] = Form.useForm();
  const newPassword = Form.useWatch("newPassword", form);

  const handleClose = () => {
    dispatch(
      actionToggleChangePasswordModal({ isOpen: false, role: EUserRole.MASTER })
    );
    form.resetFields();
  };

  const submitForm = async () => {
    const values = await getValidatedAntdFormValues(form);
    if (!values) return;
    const payload = {
      oldPassword: values.currentPassword,
      newPassword: values.newPassword,
      username,
      accessToken,
    };
    pageLoading.on();
    request({
      url: `/api/${role}/profile/changepw`,
      method: "POST",
      data: payload,
    })
      .then(() => {
        notify({
          message: "Your password has been successfully changed.",
          type: ENotificationType.SUCCESS,
          mode: EModalMode.SINGLE,
        });
        handleClose();
      })
      .finally(() => pageLoading.off());
  };

  return (
    isOpen && (
      <CustomModal
        className=""
        width={572}
        title="Change password"
        onClose={handleClose}
        footer={[
          [
            <Button
              key="back"
              className="btn-footer !text-grey-80 !border-grey-35"
              onClick={handleClose}
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              className="btn-footer !min-w-[120px]"
              onClick={submitForm}
            >
              Change password
            </Button>,
          ],
        ]}
      >
        <div className="pt-6 w-[465px]">
          <Form
            form={form}
            layout="vertical"
            className="w-full flex flex-col gap-4"
          >
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[{ required: true, message: "Cannot be blank." }]}
            >
              <CustomInputPassword placeholder="Enter your current password." />
            </Form.Item>
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Cannot be blank." },
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
                { required: true, message: "Cannot be blank." },
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
          </Form>
        </div>
      </CustomModal>
    )
  );
}

export default CustomNotification;
