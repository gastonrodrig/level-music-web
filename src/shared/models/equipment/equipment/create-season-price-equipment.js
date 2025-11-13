export const createSeasonPriceEquipmentModel = (seasonPrice) => ({
  equipment_type_id: seasonPrice.equipmentTypeId,
  reference_price: seasonPrice.referencePrice,
});
