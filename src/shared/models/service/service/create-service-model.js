const attributeMap = {
  "Número de invitados": "guests",
  "Horas de servicio": "duration",
  "Precio por hora de referencia ($)": "price_per_hour",
};

export const createServiceModel = (service) => ({
  provider_id: service.provider_id,
  service_type_id: service.service_type_id,
  serviceDetails: (service.serviceDetails || []).map((detail, idx) => {
    const details = Object.fromEntries(
      Object.entries(detail.details).map(([key, value]) => {
        const mappedKey = attributeMap[key] || key;
        const num = Number(value);
        return [mappedKey, isNaN(num) || value === "" ? value : num];
      })
    );
    return {
      details,
      ref_price: Number(detail.ref_price),
      detail_number: detail.detail_number || idx + 1,
    };
  }),
});
