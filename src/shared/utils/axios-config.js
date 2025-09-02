
export const getAuthConfig = (token, isFormData = false) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    ...(isFormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' }),
  },
});

export const getAuthConfigWithParams = (token, params = {}) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  params,
});