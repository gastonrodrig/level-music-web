import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDateTime = (value) => {
  if (!value) return null;
  return dayjs(value).tz("America/Lima").format(); 
};
