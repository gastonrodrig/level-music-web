export const updateServiceModel = (service) => ({
    serviceDetails: (service.serviceDetails || []).map(detail => {
        const detailObj = {
            details: detail.details,
            ref_price: Number(detail.ref_price),
            status: detail.status,
        };
        // Solo agrega _id si existe y no está vacío
        if (detail._id && typeof detail._id === "string" && detail._id.length === 24) {
            detailObj._id = detail._id;
        }
        return detailObj;
    })
});