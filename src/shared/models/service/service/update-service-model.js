
// Mapeo flexible: agrega aquí todos los campos personalizados que puedan aparecer
const attributeMap = {
  "Número de invitados": "guests",
  "Horas de servicio": "duration",
  "Precio por hora de referencia ($)": "price_per_hour",
  "Numero de Mesas": "table_count",
};

export const updateServiceModel = (service) => ({
  serviceDetails: (service.serviceDetails || []).map((detail) => {
    const details = Object.fromEntries(
      Object.entries(detail.details).map(([key, value]) => {
        const mappedKey = attributeMap[key] || key;
        const num = Number(value);
        return [mappedKey, isNaN(num) || value === "" ? value : num];
      })
    );
    const detailObj = {
      details,
    };
    if (detail._id) detailObj._id = detail._id;
    if (typeof detail.ref_price !== "undefined" && detail.ref_price !== "")
      detailObj.ref_price = Number(detail.ref_price);
    if (typeof detail.status !== "undefined" && detail.status !== "")
      detailObj.status = detail.status;
    return detailObj;
  }),
});
