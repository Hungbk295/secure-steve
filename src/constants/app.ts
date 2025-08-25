import en_US from "antd/locale/en_US";

export const PASSWORD_RULE_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[^\s]{8,64}$/;

export const DATE_PICKER_LOCALE: any = {
  ...en_US.DatePicker,
  lang: {
    ...en_US?.DatePicker?.lang,
    shortWeekDays: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
    shortMonths: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
};
