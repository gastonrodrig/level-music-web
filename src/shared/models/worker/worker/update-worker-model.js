export const updateWorkerModel = (worker) => ({
  worker_type_id: worker.worker_type_id,
  email: worker.email,
  phone: worker.phone,
  document_type: worker.document_type,
  document_number: worker.document_number,
  first_name: worker.first_name,
  last_name: worker.last_name,
  status: worker.status,
});