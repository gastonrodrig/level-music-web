export const createServiceDetailModel = (detail) => ({
  details: Object.fromEntries(
    Object.entries(detail.details).map(([key, value]) => {
      const num = Number(value);
      return [key, isNaN(num) || value === "" ? value : num];
    })
  ),
  ref_price: Number(detail.ref_price),
});