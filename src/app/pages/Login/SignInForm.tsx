import CustomButton from "@/app/components/common/Button";
import CustomInputPassword from "@/app/components/common/CustomInputPassword";
import Input from "@/app/components/common/Input";
import { DynamicKeyObject, EUserRole } from "@/interfaces/app";
import { useAppDispatch } from "@/store";
import { actionLogin } from "@/store/authSlide";
import { pageLoading } from "@/utils/appStateHandle";
import { Form, Radio } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import ROUTES from "@/constants/routes";

interface ISignInFormProps {
  onForgotPassword: () => void;
  isForgot: boolean;
}

function SignInForm(props: ISignInFormProps) {
  const { onForgotPassword, isForgot } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const location = useLocation();
  const isMaster = location.pathname.includes("/sign-in");
  const username = Form.useWatch("username", form);
  const password = Form.useWatch("password", form);

  const submitForm = (values: DynamicKeyObject) => {
    console.log("SignIn Debug - Form values:", values);

    const { userRole, ...rest } = values;
    pageLoading.on();

    // Clear logout flag when user manually logs in
    localStorage.removeItem("hasLoggedOut");

    dispatch(actionLogin({ ...rest, userRole: userRole }))
      .then((result) => {
        console.log("SignIn Debug - Login result:", result);
      })
      .catch((error) => {
        console.log("SignIn Debug - Login error:", error);
      })
      .finally(() => pageLoading.off());
  };

  if (isForgot) {
    console.log("isForgot", isForgot);
  }

  return (
    <>
      <h1 className="text-[32px] font-bold">로그인하기</h1>
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
          <Input placeholder="input 박스" />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <CustomInputPassword placeholder="input 박스, 비밀번호" />
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
            className="w-full"
            htmlType="submit"
            disabled={!username || !password}
          >
            로그인
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
        <div className="flex flex-col items-center mb-4">
          <span>회원가입</span>
          <span>비밀번호 찾기 및 아이디 찾기는</span>
          <span>관리자에게 문의하세요</span>
          <button
            className="text-blue-600 hover:text-blue-800 underline cursor-pointer mt-2"
            onClick={() => navigate(ROUTES.SignUp)}
          >
            회원가입하기
          </button>
        </div>

        {/* Debug info for testing */}
        <div className="text-xs text-gray-500 mt-4 p-2 bg-gray-100 rounded">
          <div>Test Accounts:</div>
          <div>Admin: admin@company.com / admin123!@#</div>
          <div>Operator: operator@company.com / operator123!@#</div>
          <div>User: user@company.com / user123!@#</div>
        </div>
      </Form>
    </>
  );
}

export default SignInForm;
