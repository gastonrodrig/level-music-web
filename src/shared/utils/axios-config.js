
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

export const getAuthConfig2 = (token, isFormData = false) => {
  // 1. El header de autorización siempre va
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // 2. SOLO ponemos 'Content-Type' si es un JSON normal
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  // 3. Si isFormData es true, no añadimos NADA. 
  //    El navegador pondrá 'multipart/form-data; boundary=...'
  
  return { headers };
};