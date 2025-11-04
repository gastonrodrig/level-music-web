export const updateServiceModel = (service) => ({
  serviceDetails: (service.serviceDetails || []).map((detail) => {
    const detailObj = {
      details: detail.details,
      ref_price: Number(detail.ref_price),
    };
    if (
      detail._id &&
      typeof detail._id === "string" &&
      detail._id.length === 24
    ) {
      detailObj._id = detail._id;
    }
    // Solo incluye status si existe y va a cambiar
    if (typeof detail.status !== "undefined") {
      detailObj.status = detail.status;
    }
    // Incluye detail_number si lo usas en edición
    if (typeof detail.detail_number !== "undefined") {
      detailObj.detail_number = detail.detail_number;
    }
    return detailObj;
  }),
});
