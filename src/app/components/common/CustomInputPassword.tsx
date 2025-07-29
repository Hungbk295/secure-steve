import { InputProps } from "antd";
import Input from "@/app/components/common/Input";
import { useState } from "react";

function CustomInputPassword(props: InputProps) {
  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <Input
      type={isShowPassword ? "text" : "password"}
      {...props}
      suffix={
        <span
          onClick={() => setIsShowPassword(!isShowPassword)}
          className="cursor-pointer select-none text-grey-40 text-[23px]"
        >
          {isShowPassword ? (
            <i className="ri-eye-line" />
          ) : (
            <i className="ri-eye-off-line" />
          )}
        </span>
      }
    />
  );
}
export default CustomInputPassword;
