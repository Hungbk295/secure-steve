import CustomButton from "@/app/components/common/Button";
import CustomInputPassword from "@/app/components/common/CustomInputPassword";
import Input from "@/app/components/common/Input";
import URL from "@/constants/url";
import { DynamicKeyObject, EUserRole } from "@/interfaces/app";
import { useAppDispatch } from "@/store";
import { actionLogin } from "@/store/authSlide";
import { pageLoading } from "@/utils/appStateHandle";
import { Form, Radio } from "antd";
import { useLocation } from "react-router-dom";

interface ISignInFormProps {
  onForgotPassword: () => void;
}

function SignInForm(props: ISignInFormProps) {
  const { onForgotPassword } = props;
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const location = useLocation();
  const isMaster = location.pathname.includes(URL.SignInMaster);
  const username = Form.useWatch("username", form);
  const password = Form.useWatch("password", form);

  const submitForm = (values: DynamicKeyObject) => {
    const { userRole, ...rest } = values;
    pageLoading.on();
    dispatch(
      actionLogin({ ...rest, userRole: userRole || EUserRole.MASTER })
    ).finally(() => pageLoading.off());
  };

  return (
    <>
      <h1 className="text-[32px] font-bold">Sign in to your account</h1>
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
          // validateTrigger={["onSubmit"]}
        >
          <Input placeholder="Enter your email address" />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <CustomInputPassword placeholder="Enter your password" />
        </Form.Item>
        {!isMaster && (
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
        )}
        <div>
          <CustomButton
            className="w-full mb-4"
            htmlType="submit"
            disabled={!username || !password}
          >
            Sign in
          </CustomButton>
          {!isMaster && (
            <span
              className="text-sm text-grey-80 font-bold cursor-pointer select-none underline"
              onClick={onForgotPassword}
            >
              Forgot password?
            </span>
          )}
        </div>
      </Form>
    </>
  );
}

export default SignInForm;
