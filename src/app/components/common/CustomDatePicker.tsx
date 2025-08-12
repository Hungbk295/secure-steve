import React, { useMemo, useState } from "react";
import { Button, Divider, FormInstance } from "antd";
import { Dayjs } from "dayjs";
import { dayjsKR } from "@/libs/date";
import RangePicker from "@/app/components/common/RangePicker";
import { cn } from "@/libs/utils";
import { RangePickerProps } from "antd/es/date-picker";

interface DateOptionType {
  label: string;
  value: "today" | "1week" | "1month" | "3month";
}

const dateOptions: DateOptionType[] = [
  { label: "Today", value: "today" },
  { label: "1 Week", value: "1week" },
  { label: "1 Month", value: "1month" },
  { label: "3 Month", value: "3month" },
];

interface CustomDatePickerProps {
  form?: FormInstance<any>;
  name?: string;
  value?: [Dayjs | null, Dayjs | null];
  onChange?: (dates: [Dayjs | null, Dayjs | null]) => void;
  showTime?: boolean | RangePickerProps["showTime"];
  showQuickPicker?: boolean;
  disabled?: boolean;
  onModifyForm?: () => void;
}

function CustomDatePicker(props: CustomDatePickerProps) {
  const {
    form,
    name,
    value,
    onChange,
    showTime = false,
    showQuickPicker = true,
    disabled = false,
    onModifyForm,
  } = props;
  const [open, setOpen] = useState(false);
  const formatType = showTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD";
  const isFieldError = form && name ? form.getFieldError(name).length : 0;

  const dateValues: [Dayjs | null, Dayjs | null] = useMemo(() => {
    // If using local state mode
    if (value) {
      return [
        value[0] ? dayjsKR(value[0]) : null,
        value[1] ? dayjsKR(value[1]) : null,
      ];
    }

    // If using form mode
    if (!form?.getFieldValue(name)) return [null, null];
    return [
      form.getFieldValue(name)?.[0]
        ? dayjsKR(form.getFieldValue(name)?.[0])
        : null,
      form.getFieldValue(name)?.[1]
        ? dayjsKR(form.getFieldValue(name)?.[1])
        : null,
    ];
  }, [form?.getFieldValue(name), value, name]);

  function handleChangeFormValue([start, end]: [Dayjs | null, Dayjs | null]) {
    onModifyForm?.();

    // If using local state mode
    if (onChange) {
      onChange([start, end]);
      return;
    }

    // If using form mode
    if (form && name) {
      form.setFieldsValue({
        [name]: [start, end],
      });
    }
  }

  function handleDateOptionClick(
    e: React.MouseEvent,
    option: DateOptionType["value"]
  ) {
    e.stopPropagation(); // Prevent triggering RangePicker open
    const end = dayjsKR();
    let start = end;

    switch (option) {
      case "today":
        start = end;
        break;
      case "1week":
        start = end.subtract(1, "week");
        break;
      case "1month":
        start = end.subtract(1, "month");
        break;
      case "3month":
        start = end.subtract(3, "months");
        break;
    }

    handleChangeFormValue([start, end]);
    setOpen(false);
  }

  function isOptionActive(option: DateOptionType["value"]): boolean {
    if (!dateValues[0] || !dateValues[1]) return false;

    const start = dateValues[0];
    const end = dateValues[1];

    const today = dayjsKR();

    switch (option) {
      case "today":
        return start.isSame(today, "day") && end.isSame(today, "day");
      case "1week":
        return (
          start.isSame(today.subtract(1, "week"), "day") &&
          end.isSame(today, "day")
        );
      case "1month":
        return (
          start.isSame(today.subtract(1, "month"), "day") &&
          end.isSame(today, "day")
        );
      case "3month":
        return (
          start.isSame(today.subtract(3, "month"), "day") &&
          end.isSame(today, "day")
        );
      default:
        return false;
    }
  }

  return (
    <div
      className={cn(
        "h-[45px] flex items-center rounded-[8px] px-4 py-[10px] border border-grey-10",
        disabled ? "bg-gray-100" : "bg-white",
        isFieldError && "border-error-100 bg-error-2"
      )}
    >
      <div className="flex items-center gap-4 w-full">
        <div
          className={cn(
            "flex items-center gap-2 text-grey-40 flex-1",
            !disabled && "cursor-pointer"
          )}
          onClick={() => !disabled && setOpen(true)}
        >
          <div className="min-w-[70px]">
            {dateValues?.[0]?.format(formatType)}
          </div>
          <div>~</div>
          <div className="min-w-[70px]">
            {dateValues?.[1]?.format(formatType)}
          </div>
        </div>
        {showQuickPicker && (
          <>
            <Divider
              className="!h-[20px] border-grey-10 border-[1px]"
              type="vertical"
            />
            <div className="flex items-center justify-between w-[264px]">
              {dateOptions.map((option) => (
                <Button
                  key={option.value}
                  className={cn(
                    "daterangepicker-quick-button",
                    isOptionActive(option.value) &&
                      "!border-primary-80 !bg-primary-10 !font-bold !text-primary-105"
                  )}
                  onClick={(e) =>
                    !disabled && handleDateOptionClick(e, option.value)
                  }
                  disabled={disabled}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
      <RangePicker
        showTime={showTime}
        popupClassName={cn(showTime && "time-picker-popup")}
        style={{
          position: "absolute",
          opacity: 0,
          transform: "translateX(-10px)",
        }}
        value={dateValues}
        open={open && !disabled}
        onChange={(values) => {
          handleChangeFormValue(values as [Dayjs | null, Dayjs | null]);
          setOpen(false);
        }}
        allowClear={false}
        onOpenChange={(isOpen) => !disabled && setOpen(isOpen)}
        disabled={disabled}
      />
    </div>
  );
}

export default CustomDatePicker;
