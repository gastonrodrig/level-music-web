export const updateClientProfileModel = (file) => {
  const formData = new FormData();

  if (file) {
    formData.append("imageFile", file);
  }

  return formData;
};
