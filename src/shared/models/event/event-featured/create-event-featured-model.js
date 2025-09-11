export const createEventFeaturedModel = (event) => {
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
  event.images.forEach((file, index) => {
  console.log(`Image[${index}]:`, file, file instanceof File);
    formData.append("images", file);
  });
}
  return formData;
};