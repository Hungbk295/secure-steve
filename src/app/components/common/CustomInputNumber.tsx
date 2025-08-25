import { useEffect, useState } from "react";
import { InputProps } from "antd";
import Input from "@/app/components/common/Input";

type TInputProps = InputProps & {
  onChangeForm: (value: any) => void;
  max?: number;
};

function CustomInputNumber(props: TInputProps) {
  const { onChangeForm, defaultValue = "", max = 0, ...rest } = props;
  const [inputValue, setInputValue] = useState(defaultValue);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numeric = Number(value.replace(/\D/g, ""));
    setInputValue(Math.min(numeric, max));
  };

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    onChangeForm(inputValue);
  }, [inputValue]);

  return (
    <Input
      {...rest}
      allowClear={false}
      value={inputValue}
      onChange={handleChangeInput}
    />
  );
}

export default CustomInputNumber;
