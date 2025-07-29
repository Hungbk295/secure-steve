import React from "react";
import { DatePicker } from "antd";
import { cn } from "@/libs/utils";
import { DATE_PICKER_LOCALE } from "@/constants/app";

const { RangePicker: AntdRangePicker } = DatePicker;

type RangePickerProps = React.ComponentProps<typeof AntdRangePicker>;

function RangePicker(props: RangePickerProps) {
  const { className, popupClassName, ...rest } = props;
  return (
    <AntdRangePicker
      locale={DATE_PICKER_LOCALE}
      className={cn(className, "")}
      popupClassName={cn("custom-range-picker-popup", popupClassName)}
      {...rest}
    />
  );
}

export default RangePicker;
