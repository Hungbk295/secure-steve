import { InputNumber, InputNumberProps } from "antd";
import { cn } from "@/libs/utils";

type LookToBookInputProps = InputNumberProps & {
  suffix?: string;
};

function LookToBookInput(props: LookToBookInputProps) {
  const { className, suffix = ": 1", ...rest } = props;

  return (
    <div className="flex items-center">
      <InputNumber
        className={cn("h-[45px] !min-w-[90px] items-center", className)}
        {...rest}
      />
      <span className="ml-2">{suffix}</span>
    </div>
  );
}

export default LookToBookInput;
