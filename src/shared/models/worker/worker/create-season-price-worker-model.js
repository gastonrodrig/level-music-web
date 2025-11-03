export const createSeasonPriceWorkerModel = (seasonPrice) => ({
  worker_id: seasonPrice.workerId,
  reference_price: seasonPrice.referencePrice,
});
