import { createServiceDetailModel } from '../service-detail/create-service-detail-model';

export const createServiceModel = (service) => ({
  provider_id: service.provider_id,
  service_type_id: service.service_type_id,
  serviceDetails: service.serviceDetails.map(createServiceDetailModel)
});