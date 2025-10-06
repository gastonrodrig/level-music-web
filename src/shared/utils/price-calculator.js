// Función para convertir valores a números de forma segura
export const num = (v) => (v === "" || v == null ? 0 : Number(v) || 0);

// Función principal para calcular precio estimado
export const calcEstimatedPrice = ({
  services = [],
  equipments = [],
  workers = [],
}) => {
  const servicesTotal = services.reduce(
    (acc, s) => acc + num(s.service_price) * num(s.service_hours),
    0
  );
  const equipmentsTotal = equipments.reduce(
    (acc, e) => acc + num(e.equipment_price) * num(e.equipment_hours),
    0
  );
  const workersTotal = workers.reduce(
    (acc, w) => acc + num(w.worker_price) * num(w.worker_hours),
    0
  );
  return servicesTotal + equipmentsTotal + workersTotal;
};

// Funciones para calcular totales específicos
export const calcServicesTotal = (services = []) => 
  calcEstimatedPrice({ services });

export const calcEquipmentsTotal = (equipments = []) => 
  calcEstimatedPrice({ equipments });

export const calcWorkersTotal = (workers = []) => 
  calcEstimatedPrice({ workers });