import { Rule } from "antd/es/form";
import { FormInstance } from "antd";
import { DynamicKeyObject } from "@/interfaces/app";
import dayjs from "dayjs";

export const createTrimValidator = (
  fieldName: string,
  errorMessage: string = `${fieldName} cannot be empty or just spaces`
): Rule[] => [
  {
    validator: (_, value) => {
      if (!value) return Promise.resolve();
      if (value.trim().length === 0) {
        return Promise.reject(new Error(errorMessage));
      }
      return Promise.resolve();
    },
  },
];

export const createTrimOnBlurHandler =
  (form: FormInstance, fieldName: string) =>
  (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const trimmedValue = value.trimEnd();
    if (value !== trimmedValue) {
      form.setFieldsValue({ [fieldName]: trimmedValue });
    }
  };

export const validatorAntdEmailInput = {
  validator: (_: any, value: any) => {
    if (value && (value?.includes("&") || value?.includes("#"))) {
      return Promise.reject("Please enter a valid email address.");
    }
    return Promise.resolve();
  },
};

export const validatorRequiredFormItem = {
  validator: (_: any, value: any) => {
    if (!value || (Array.isArray(value) && !value?.length)) {
      return Promise.reject(new Error("Cannot be blank."));
    }
    return Promise.resolve();
  },
  validateTrigger: "onSubmit",
};

export const validatorAntdFormInput = {
  validator: (_: any, value: any) => {
    if (value && !value?.trim()) {
      return Promise.reject("Cannot contain only whitespace.");
    }
    return Promise.resolve();
  },
};

export const validatorPhoneNumber = {
  validator: (_: any, value: any) => {
    if (!value?.length) {
      return Promise.resolve();
    }
    if (value.length <= 4 && !/^\d+$/.test(value)) {
      return Promise.reject("Only numeric digits (0-9) are allowed.");
    }
    if (value.length === 16 && !/^\d+$/.test(value)) {
      return Promise.resolve();
    }
    if (value.length < 4 || value.length > 15) {
      return Promise.reject("Phone number must be between 4 and 15 digits.");
    }
    return Promise.resolve();
  },
};

export const validatorRangePicker = {
  validator: (_: any, value: any) => {
    const isValidStart = dayjs(value?.[0]).isValid();
    const isValidEnd = dayjs(value?.[1]).isValid();
    if (value?.length && (!isValidStart || !isValidEnd)) {
      return Promise.reject("Invalid date.");
    }
    return Promise.resolve();
  },
};

export const validateAntdFormAutoComplete = (options: DynamicKeyObject[]) => {
  return {
    validator: (_: any, value: any) => {
      const isSelected = options.some((item) => item.value === value);
      if (value && !isSelected) {
        return Promise.reject("No options matched.");
      }
      return Promise.resolve();
    },
  };
};
