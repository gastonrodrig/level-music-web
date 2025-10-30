export const createSeasonPriceWorkerModel = (seasonPrice) => ({
  worker_type_id: seasonPrice.workerTypeId,
  reference_price: seasonPrice.referencePrice,
});
