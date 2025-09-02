export const updateEventFeaturedModel = (event) => {
  const formData = new FormData();

  formData.append("event_id", event.event_id);
  formData.append("title", event.title);

  if (event.featured_description) {
    formData.append("featured_description", event.featured_description);
  }

  if (event.services) {
    formData.append("services", JSON.stringify(event.services));
  }

  if (Array.isArray(event.images)) {
    event.images.forEach((file) => {
      formData.append("images", file); 
    });
  }

  return formData;
};