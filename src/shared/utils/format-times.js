import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/es"; 

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("es");

/**
 * Formatea solo la hora (ej: "2:00 p. m.")
 */
export const formatTimeString = (dateString) => {
  if (!dateString) return "";
  return dayjs(dateString).tz("America/Lima").format("h:mm A");
};

/**
 * Formatea un rango horario (ej: "2:00 p. m. - 8:00 p. m.")
 */
export const formatTimeRange = (start, end) => {
  if (!start || !end) return "";
  return `${formatTimeString(start)} - ${formatTimeString(end)}`;
};