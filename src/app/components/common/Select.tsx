import { Select as AntdSelect, SelectProps } from "antd";
import { cn } from "@/libs/utils";

type TSelectProps = SelectProps;

function Select(props: TSelectProps) {
  const { className, popupClassName, ...rest } = props;

  return (
    <AntdSelect
      className={cn("custom-select", className)}
      suffixIcon={
        <i className="ri-arrow-down-s-fill text-2xl text-grey-80"></i>
      }
      popupClassName={cn("custom-select-popup", popupClassName)}
      {...rest}
    />
  );
}

export default Select;
