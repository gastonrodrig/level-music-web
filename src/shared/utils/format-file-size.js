export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024; // 1 KB = 1024 bytes
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]; // Unidades disponibles
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
