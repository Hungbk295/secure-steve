import { DynamicKeyObject } from "@/interfaces/app";
import { cn } from "@/libs/utils";
import { Radio } from "antd";
import { RadioGroupProps } from "antd/es/radio/interface";

type CustomRadioGroupProps = Omit<RadioGroupProps, "options"> & {
  options: DynamicKeyObject[];
  className?: string;
};

function CustomRadioGroup(props: CustomRadioGroupProps) {
  const { options, className, ...rest } = props;
  return (
    <Radio.Group
      className={cn("h-[45px] !flex items-center gap-4", className)}
      {...rest}
    >
      {options.map((item) => (
        <Radio value={item.value}>{item.label}</Radio>
      ))}
    </Radio.Group>
  );
}

export default CustomRadioGroup;
