import CustomButton from "@/app/components/common/Button";
import CustomInputPassword from "@/app/components/common/CustomInputPassword";
import Input from "@/app/components/common/Input";
import { DynamicKeyObject } from "@/interfaces/app";
import { Form, Modal } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from "@/constants/routes";

function SignUpForm() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const email = Form.useWatch("email", form);
  const password = Form.useWatch("password", form);
  const confirmPassword = Form.useWatch("confirmPassword", form);
  const name = Form.useWatch("name", form);
  const phone = Form.useWatch("phone", form);
  const department = Form.useWatch("department", form);

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('비밀번호를 입력해주세요'));
    }
    
    if (value.length < 10) {
      return Promise.reject(new Error('10자 이상 입력해주세요'));
    }
    
    const hasEnglish = /[a-zA-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    if (!hasEnglish || !hasNumber || !hasSpecial) {
      return Promise.reject(new Error('영문, 숫자, 특수문자 모두 포함해주세요'));
    }
    
    for (let i = 0; i < value.length - 2; i++) {
      if (value[i] === value[i + 1] && value[i] === value[i + 2]) {
        return Promise.reject(new Error('동일 문자 3회 연속 사용할 수 없습니다'));
      }
    }
    
    return Promise.resolve();
  };

  const validateConfirmPassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('비밀번호 확인을 입력해주세요'));
    }
    if (value !== password) {
      return Promise.reject(new Error('비밀번호가 일치하지 않습니다'));
    }
    return Promise.resolve();
  };

  const validatePhone = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('전화번호를 입력해주세요'));
    }
    if (!/^\d+$/.test(value)) {
      return Promise.reject(new Error('숫자만 입력해주세요'));
    }
    return Promise.resolve();
  };

  const submitForm = async (values: DynamicKeyObject) => {
    try {
      console.log('Registration values:', values);
      
      setIsModalVisible(true);
      
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate(ROUTES.SignIn); 
  };

  const handleCancel = () => {
    navigate(ROUTES.SignIn); 
  };

  return (
    <div className="flex items-center h-screen">
      <div className="flex-1">
        <div className="w-[400px] mx-auto flex flex-col gap-8 items-center">
          <h1 className=" text-center mb-4 w-[400px] text-[32px] font-bold">회원가입</h1>
          
          <div className="flex flex-col gap-8 w-[400px]">
            <div className="flex">
              <Form
                form={form}
                layout="vertical"
                onFinish={submitForm}
                className="w-full flex flex-col gap-6"
              >
                <Form.Item
                  label="E-mail"
                  name="email"
                  rules={[
                    { required: true, message: 'E-mail을 입력해주세요' },
                    { type: "email", message: "올바른 E-mail 형식이 아닙니다" },
                  ]}
                >
                  <Input placeholder="E-mail을 입력해주세요" />
                </Form.Item>

                <Form.Item 
                  label="비밀번호" 
                  name="password"
                  rules={[
                    { required: true, validator: validatePassword }
                  ]}
                >
                  <CustomInputPassword placeholder="비밀번호를 입력해주세요" />
                </Form.Item>
                <div className="text-xs text-gray-500 -mt-4">
                  *10자 이상, 영문, 숫자, 특수문자 모두 포함
                </div>

                <Form.Item 
                  label="비밀번호확인" 
                  name="confirmPassword"
                  rules={[
                    { required: true, validator: validateConfirmPassword }
                  ]}
                >
                  <CustomInputPassword placeholder="비밀번호를 다시 입력해주세요" />
                </Form.Item>

                <Form.Item
                  label="이름"
                  name="name"
                  rules={[
                    { required: true, message: '이름을 입력해주세요' },
                  ]}
                >
                  <Input placeholder="이름을 입력해주세요" />
                </Form.Item>

                <Form.Item
                  label="전화번호"
                  name="phone"
                  rules={[
                    { required: true, validator: validatePhone }
                  ]}
                >
                  <Input placeholder="숫자만 입력 (예: 01098765432)" />
                </Form.Item>
                <div className="text-xs text-gray-500 -mt-4">
                  *숫자만 입력(예, 01098765432)
                </div>

                <Form.Item
                  label="부서/직책"
                  name="department"
                  rules={[
                    { required: true, message: '부서/직책을 입력해주세요' },
                  ]}
                >
                  <Input placeholder="부서/직책을 입력해주세요" />
                </Form.Item>

                <div className="flex gap-4 mt-6">
                  <CustomButton
                    className="flex-1"
                    htmlType="submit"
                    disabled={!email || !password || !confirmPassword || !name || !phone || !department}
                  >
                    인증요청
                  </CustomButton>
                  <CustomButton
                    className="flex-1"
                    onClick={handleCancel}
                    type="default"
                  >
                    취소
                  </CustomButton>
                </div>
              </Form>
            </div>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              이미 계정이 있으신가요?{" "}
              <button
                className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                onClick={() => navigate(ROUTES.SignIn)}
              >
                로그인하기
              </button>
            </span>
          </div>
        </div>
      </div>

      <Modal
        title="회원가입 요청"
        open={isModalVisible}
        onOk={handleModalOk}
        footer={[
          <CustomButton key="ok" onClick={handleModalOk}>
            확인
          </CustomButton>
        ]}
        closable={false}
        maskClosable={false}
      >
        <p className="text-center py-4">관리자 승인 대기중입니다.</p>
      </Modal>
    </div>
  );
}

export default SignUpForm; 