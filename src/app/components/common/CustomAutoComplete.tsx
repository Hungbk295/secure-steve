import { AutoComplete as AntdAutoComplete, AutoCompleteProps } from "antd";
import { cn } from "@/libs/utils";
import { useRef, useState } from "react";
import { DEFAULT_AUTOCOMPLETE_OPTION } from "@/constants/options";

type TCustomAutoCompleteProps = AutoCompleteProps;

function CustomAutoComplete(props: TCustomAutoCompleteProps) {
  const { className, popupClassName, onClear, ...rest } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const isClearingRef = useRef(false);

  const handleFilterOption = (inputValue: string, option: any) => {
    setHasValue(true);
    const searchTerm = inputValue.toUpperCase();
    if (searchTerm === DEFAULT_AUTOCOMPLETE_OPTION.realValue) {
      return true;
    }
    const label = String(option?.label).toUpperCase();
    const value = String(option?.value).toUpperCase();
    return label.includes(searchTerm) || value.includes(searchTerm);
  };

  const handleClear = () => {
    isClearingRef.current = true;
    setHasValue(false);
    setIsOpen(true);
    onClear?.();
  };

  const handleDropdownVisibleChange = (visible: boolean) => {
    if (isClearingRef.current) {
      isClearingRef.current = false;
      return;
    }
    setIsOpen(visible);
  };

  return (
    <AntdAutoComplete
      className={cn(
        "custom-select autocomplete",
        className,
        hasValue && "has-value"
      )}
      suffixIcon={
        <i className="ri-arrow-down-s-fill text-2xl text-grey-80"></i>
      }
      popupClassName={cn("custom-select-popup autocomplete", popupClassName)}
      filterOption={handleFilterOption}
      allowClear
      open={isOpen}
      onDropdownVisibleChange={handleDropdownVisibleChange}
      onClear={handleClear}
      notFoundContent="No options"
      popupMatchSelectWidth={false}
      {...rest}
    />
  );
}

export default CustomAutoComplete;
