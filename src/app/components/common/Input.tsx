import { Input as AntdInput, InputProps } from "antd";
import { cn } from "@/libs/utils";

type TInputProps = InputProps;

function Input(props: TInputProps) {
  const { className, ...rest } = props;

  return (
    <AntdInput className={cn("custom-input", className)} allowClear {...rest} />
  );
}

const TextArea = (props: any) => {
  const { className, ...rest } = props;

  return (
    <AntdInput.TextArea
      className={cn("custom-input", className)}
      allowClear
      {...rest}
    />
  );
};

Input.TextArea = TextArea;

export default Input;
