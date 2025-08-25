import { useEffect, useState } from "react";
import { Slider, SliderSingleProps } from "antd";
import Input from "@/app/components/common/Input";
import { cn } from "@/libs/utils";

type CustomSliderProps = SliderSingleProps & {
  unit?: string;
  disabled?: boolean;
  inputClassName?: string;
  onChangeForm: (value: number) => void;
};

function CustomSlider(props: CustomSliderProps) {
  const {
    min,
    max = 0,
    unit,
    onChangeForm,
    className,
    disabled,
    inputClassName,
    defaultValue = 0,
    ...rest
  } = props;
  const [inputValue, setInputValue] = useState<number>(defaultValue);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    onChangeForm(inputValue);
  }, [inputValue]);

  return (
    <div
      className={cn("flex gap-4 items-center custom-slider pb-5", className)}
    >
      <div className="px-2 flex-1">
        <Slider
          {...rest}
          min={min}
          max={max}
          disabled={disabled}
          value={inputValue}
          onChange={(next) => setInputValue(next)}
        />
      </div>
      <div className="flex items-center gap-1">
        <Input
          min={min}
          max={max}
          value={inputValue}
          onChange={(e) => {
            const numeric = Number(e.target.value.replace(/\D/g, ""));
            setInputValue(Math.min(numeric, max));
          }}
          className={cn("!w-[60px]", inputClassName)}
          allowClear={false}
          disabled={disabled}
        />
        {unit && <span className="text-xs text-grey-80 font-bold">{unit}</span>}
      </div>
    </div>
  );
}

export default CustomSlider;
