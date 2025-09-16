export const toTimeString = (t) => {
  if (!t) return null;
  if (typeof t === "string") return t.slice(0, 5);
  if (typeof t?.format === "function") return t.format("HH:mm"); // dayjs
  if (t instanceof Date) {
    const hh = String(t.getHours()).padStart(2, "0");
    const mm = String(t.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }
  return null;
};
