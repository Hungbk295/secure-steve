import Input from "@/app/components/common/Input";
import CustomButton from "@/app/components/common/Button";
import { Form, Radio } from "antd";
import {
  DynamicKeyObject,
  EModalMode,
  ENotificationType,
  EUserRole,
} from "@/interfaces/app";
import request from "@/utils/request";
import { notify, pageLoading } from "@/utils/appStateHandle";
import {
  actionUpdateRemainingEmailResend,
  selectEmailResend,
} from "@/store/authSlide";
import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";
import { convertSecondsToMinutes } from "@/utils/app";

interface IForgotPasswordFormProps {
  onSignIn: () => void;
}

const RESEND_TIMEOUT = 60;

function ForgotPasswordForm(props: IForgotPasswordFormProps) {
  const { onSignIn } = props;
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const username = Form.useWatch("username", form);
  const emailResend = useAppSelector(selectEmailResend);

  const submitForm = (values: DynamicKeyObject) => {
    pageLoading.on();
    const { username, userRole } = values;
    request({
      url: `/auth/reset/account/${userRole}/token`,
      method: "POST",
      data: { username },
    })
      .then(() => {
        dispatch(
          actionUpdateRemainingEmailResend({
            isCountDown: false,
            remaining: RESEND_TIMEOUT,
          })
        );
        notify({
          message: "The verification email has been successfully sent.",
          type: ENotificationType.SUCCESS,
          mode: EModalMode.SINGLE,
        });
      })
      .finally(() => pageLoading.off());
  };

  const setTimer = (remaining: number) => {
    dispatch(
      actionUpdateRemainingEmailResend({
        isCountDown: remaining > 0,
        remaining: remaining > 0 ? remaining : 0,
      })
    );
    if (remaining <= 0) {
      return;
    }
    setTimeout(() => setTimer(remaining - 1), 1000);
  };

  useEffect(() => {
    if (!emailResend.isCountDown && emailResend.remaining > 0) {
      setTimer(emailResend.remaining);
    }
  }, [emailResend]);

  useEffect(() => {
    if (emailResend.remaining > 0) {
      setTimer(emailResend.remaining);
    }
  }, []);

  return (
    <>
      <h1 className="text-[32px] font-bold">Forgot password?</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={submitForm}
        className="w-full flex flex-col gap-6"
      >
        <Form.Item
          label="Email address"
          name="username"
          rules={[
            { type: "email", message: "Please enter a valid email address." },
          ]}
        >
          <Input placeholder="Enter your email address" />
        </Form.Item>
        <Form.Item
          label="User type"
          name="userRole"
          initialValue={EUserRole.ADMIN}
        >
          <Radio.Group>
            <Radio value={EUserRole.ADMIN}>Admin</Radio>
            <Radio value={EUserRole.USER}>User</Radio>
          </Radio.Group>
        </Form.Item>
        <div className="">
          <CustomButton
            className="w-full"
            htmlType="submit"
            disabled={!username || emailResend.isCountDown}
          >
            Send E-mail
          </CustomButton>
          {emailResend.isCountDown && (
            <span className="block">
              Temporary password expires in{" "}
              {convertSecondsToMinutes(emailResend.remaining)}
            </span>
          )}
          <span
            className="block mt-4 text-sm text-grey-80 font-bold cursor-pointer select-none underline"
            onClick={onSignIn}
          >
            Sign in
          </span>
        </div>
      </Form>
    </>
  );
}

export default ForgotPasswordForm;
