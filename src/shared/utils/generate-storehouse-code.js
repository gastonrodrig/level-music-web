export const generateStorehouseCode = (type) => {
  const prefix = type.startsWith("Salida") ? "SAL" : "REC";
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${random}`;
};