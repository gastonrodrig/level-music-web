export const createServiceModel = (service) => ({
  provider_id: service.provider_id,
  service_type_id: service.service_type_id,
  serviceDetails: service.serviceDetails.map((detail, idx) => ({
    details: Object.fromEntries(
      Object.entries(detail.details).map(([key, value]) => {
        const num = Number(value);
        return [key, isNaN(num) || value === "" ? value : num];
      })
    ),
    ref_price: detail.ref_price,
    detail_number: detail.detail_number || idx + 1,
  })),
});
