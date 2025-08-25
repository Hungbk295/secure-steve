import React from "react";
import { DatePicker } from "antd";
import { cn } from "@/libs/utils";
import { DATE_PICKER_LOCALE } from "@/constants/app";

type SingleDatePickerProps = React.ComponentProps<typeof DatePicker>;

function SingleDatePicker(props: SingleDatePickerProps) {
  const { className, ...rest } = props;

  return (
    <DatePicker
      locale={DATE_PICKER_LOCALE}
      className={cn("custom-input w-full", className)}
      popupClassName="custom-range-picker-popup single"
      allowClear={false}
      {...rest}
    />
  );
}

export default SingleDatePicker;
