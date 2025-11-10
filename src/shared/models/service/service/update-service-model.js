export const updateServiceModel = (form) => {
  const formData = new FormData();

  // detalles limpios (sin fotos)
  const details = (form.serviceDetails || []).map((d, i) => ({
    _id: d._id?.length === 24 ? d._id : undefined,
    details: Object.fromEntries(
      Object.entries(d.details || {}).map(([k, v]) => {
        const n = Number(v);
        return [k, isNaN(n) || v === "" ? v : n];
      })
    ),
    ref_price: Number(d.ref_price),
    status: d.status,
    detail_number: d.detail_number || i + 1,
  }));

  formData.append("serviceDetails", JSON.stringify(details));

  // fotos nuevas
  (form.serviceDetails || []).forEach((d, i) =>
    d.photos?.forEach(
      (f) => f instanceof File && formData.append(`photos_${d.detail_number || i + 1}`, f)
    )
  );

  // fotos a eliminar
  if (form.photosToDelete?.length)
    formData.append("photos_to_delete", JSON.stringify(form.photosToDelete));

  return formData;
};
