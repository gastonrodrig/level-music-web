export const formatDateString = (dateString) => {
  if (!dateString) return "Sin fecha";
  const d = new Date(dateString);
  if (isNaN(d)) return "Fecha inválida"; // por si te llega mal el formato
  return d.toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
