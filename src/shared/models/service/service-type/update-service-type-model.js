export const updateServiceTypeModel = (serviceType) => ({
  name: serviceType.name,
  description: serviceType.description,
  status: serviceType.status,
  attributes: serviceType.attributes.map(attr => ({
    name: attr.name,
    type: attr.type,
    default: attr.default,
  })),
});