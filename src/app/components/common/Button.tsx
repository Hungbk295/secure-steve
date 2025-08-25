import { Button as AntdButton, ButtonProps } from "antd";
import { cn } from "@/libs/utils";

type TCustomButtonProps = ButtonProps & {
  theme?: "primary" | "black" | "white";
  variant?: "filled" | "outlined";
};

function CustomButton(props: TCustomButtonProps) {
  const { className, theme = "primary", variant = "filled", ...rest } = props;

  return (
    <AntdButton
      className={cn(
        "custom-button !h-11 !py-[10px] !px-4 !rounded-[8px] min-w-[85px]",
        theme,
        variant,
        className
      )}
      {...rest}
    />
  );
}

export default CustomButton;
