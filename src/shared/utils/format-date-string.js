export const formatDateString = (dateString) =>
  dateString
    ? new Date(dateString).toLocaleDateString("es-PE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Sin fecha";
