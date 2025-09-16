export const updateEventFeaturedModel = (event) => {
  // Validar event_id
  if (!event.event_id || typeof event.event_id !== 'string' || !event.event_id.trim()) {
    throw new Error('event_id should not be empty');
  }

  // Detectar si hay imágenes tipo File
  const onlyFiles = Array.isArray(event.images)
    ? event.images.filter((img) => img instanceof File)
    : [];

  if (onlyFiles.length === 0) {
    // No hay imágenes nuevas, enviar JSON plano
    return {
      event_id: event.event_id,
      title: event.title,
      featured_description: event.featured_description || "",
      services: event.services || [],
    };
  }

  // Si hay imágenes, construir FormData
  const formData = new FormData();
  formData.append("event_id", event.event_id);
  formData.append("title", event.title);
  formData.append("featured_description", event.featured_description || "");
  formData.append("services", JSON.stringify(event.services || []));
  onlyFiles.forEach((file) => formData.append("images", file));
  return formData;
};