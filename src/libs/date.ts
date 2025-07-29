import dayjs from "dayjs";

function dayjsKR(date?: dayjs.ConfigType, format?: dayjs.OptionType) {
  if (!date) return dayjs();
  if (!format) return dayjs(date);
  return dayjs(date, format);
}

export { dayjsKR };
