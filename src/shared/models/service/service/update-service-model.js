export const updateServiceModel = (service) => ({
    serviceDetails: (service.serviceDetails || []).map(detail => ({
        _id: detail._id, // <-- agrega el _id si existe
        details: detail.details,
        ref_price: detail.ref_price,
        status: detail.status || 'Activo'
    }))
});