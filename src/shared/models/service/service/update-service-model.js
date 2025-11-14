export const updateServiceModel = (form) => {
  const formData = new FormData();

  (form.serviceDetails || []).forEach((d, i) => {
    formData.append(`serviceDetails[${i}][_id]`, d._id);
    formData.append(`serviceDetails[${i}][ref_price]`, Number(d.ref_price));
    formData.append(`serviceDetails[${i}][status]`, d.status);

    const details = d.details || {};
    Object.entries(details).forEach(([key, value]) => {
      const n = Number(value);
      formData.append(
        `serviceDetails[${i}][details][${key}]`,
        isNaN(n) || value === "" ? value : n
      );
    });
  });

  (form.serviceDetails || []).forEach((d, i) => {
    (d.photos || []).forEach((f) => {
      if (f instanceof File) {
        formData.append(`photo_${i + 1}`, f);
      }
    });
  });

  if (form.photosToDelete?.length) {
    formData.append("photos_to_delete", JSON.stringify(form.photosToDelete));
  }

  return formData;
};
