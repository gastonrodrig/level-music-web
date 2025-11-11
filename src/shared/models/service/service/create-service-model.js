export const createServiceModel = (form) => {
  const formData = new FormData();

  formData.append("provider_id", form.provider_id);
  formData.append("service_type_id", form.service_type_id);

  // Agregar detalles
  (form.serviceDetails || []).forEach((d, i) => {
    const details = d.details || {};

    // Campos principales
    formData.append(`serviceDetails[${i}][ref_price]`, Number(d.ref_price));

    // Atributos dinámicos
    Object.entries(details).forEach(([key, value]) => {
      const num = Number(value);
      formData.append(
        `serviceDetails[${i}][details][${key}]`,
        isNaN(num) || value === "" ? value : num
      );
    });

    // Fotos con nombre secuencial: photo_1, photo_2, ...
    (d.photos || []).forEach((f) => {
      if (f instanceof File) {
        formData.append(`photo_${i + 1}`, f);
      }
    });
  });

  return formData;
};
