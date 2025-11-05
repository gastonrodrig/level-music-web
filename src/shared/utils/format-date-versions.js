export const formatEventVersions = (event) => {
  const { event_date, start_time, end_time } = event;
  if (!event_date || !start_time || !end_time) return "N/A";

  const date = new Date(event_date);
  const start = new Date(start_time);
  const end = new Date(end_time);

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  const hhStart = String(start.getHours()).padStart(2, "0");
  const minStart = String(start.getMinutes()).padStart(2, "0");

  const hhEnd = String(end.getHours()).padStart(2, "0");
  const minEnd = String(end.getMinutes()).padStart(2, "0");

  return `${dd}/${mm}/${yyyy} ${hhStart}:${minStart} - ${hhEnd}:${minEnd}`;
};
