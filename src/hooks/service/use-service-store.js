
import { useDispatch, useSelector } from "react-redux";
import { createServiceModel, updateServiceModel } from "../../shared/models";
import {
  listAllServices,
  refreshService,
  selectedService,
  setLoadingService,
  setPageService,
  setRowsPerPageService,
  showSnackbar,
} from "../../store";
import { useState } from "react";
import { serviceApi } from "../../api";
import { getAuthConfig, getAuthConfigWithParams, getAuthConfig2 } from "../../shared/utils";
 
    

export const useServiceStore = () => {
  const dispatch = useDispatch();
 
  const { 
    services, 
    selected, 
    total, 
    loading, 
    currentPage, 
    rowsPerPage 
  } = useSelector((state) => state.service);

  const { token } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const [customAttributes, setCustomAttributes] = useState([]);
  const [selectedFields, setSelectedFields] = useState({});
  const [openFieldModalIdx, setOpenFieldModalIdx] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreateService = async (serviceDataFromForm) => {
    if (!validateDetails(serviceDataFromForm.serviceDetails)) return false;
    dispatch(setLoadingService(true));
    try {
      const formData = new FormData();
      formData.append('provider_id', serviceDataFromForm.provider_id);
      formData.append('service_type_id', serviceDataFromForm.service_type_id);

      const detailsForJSON = serviceDataFromForm.serviceDetails.map((detail, idx) => ({
        details: Object.fromEntries(
          Object.entries(detail.details).map(([key, value]) => {
            const num = Number(value);
            return [key, isNaN(num) || value === "" ? value : num];
          })
        ),
        ref_price: detail.ref_price,
        detail_number: detail.detail_number || idx + 1,
      }));
      formData.append('serviceDetails', JSON.stringify(detailsForJSON));

      serviceDataFromForm.serviceDetails.forEach((detail, idx) => {
        const detailNum = detail.detail_number || idx + 1;
        const fieldName = `photos_${detailNum}`;
        if (detail.photos && detail.photos.length > 0) {
          detail.photos.forEach(file => {
            formData.append(fieldName, file); // 'file' debe ser un objeto File
          });
        }
      });

      const { data } = await serviceApi.post("", formData, getAuthConfig2(token,true)); // Restaurado: con headers de auth
      // Re-fetch canonical service from backend to ensure we have the authoritative version
      if (data && data._id) {
        await startFetchServiceById(data._id);
        openSnackbar("El servicio fue creado exitosamente.");
        return data; // retorna el objeto creado
      }
      return false;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al crear el tipo de servicio.");
      return false;
    } finally {
      dispatch(setLoadingService(false));
    }
  };

  const startFetchServiceById = async (id) => {
    dispatch(setLoadingService(true));
    try {
      const { data } = await serviceApi.get(`/${id}`, getAuthConfig(token));
      // Si la respuesta tiene serviceDetails como propiedad separada, combínala
      let serviceData = data;
      if (data.service && Array.isArray(data.serviceDetails)) {
        serviceData = { ...data.service, serviceDetails: data.serviceDetails };
      }
      dispatch(selectedService({ ...serviceData }));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      const notifyServiceLoadError = (message) => openSnackbar(message ?? "Ocurrió un error al cargar los servicios.");
      return false;
    } finally {
      dispatch(setLoadingService(false));
    }
  };

  const startLoadingAllServices = async () => {
    dispatch(setLoadingService(true));
    try {
      const { data } = await serviceApi.get("/all");
      dispatch(listAllServices(data));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
  const notifyLoadError = (message) => openSnackbar(message ?? "Ocurrió un error al cargar.");
      return false;
    } finally {
      dispatch(setLoadingService(false));
    }
  };

  const startLoadingServicePaginated = async () => {
    dispatch(setLoadingService(true));
    try {
       const limit  = rowsPerPage;
      const offset = currentPage * rowsPerPage;
      const { data } = await serviceApi.get('/paginated',
        getAuthConfigWithParams(token, {
          limit,
          offset,
          search: searchTerm.trim(),
          sortField: orderBy,
          sortOrder: order,
        })
      );
      dispatch(refreshService({
        items: data.items,
        total: data.total,
        page: currentPage,
      }));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
  openSnackbar("El servicio fue actualizado exitosamente.");
      return false;
    } finally {
      dispatch(setLoadingService(false));
    }
  };

  const startUpdateService = async (id, serviceDataFromForm) => {
    if (!validateDetails(serviceDataFromForm.serviceDetails)) return false;
    dispatch(setLoadingService(true));
    try {
      const formData = new FormData();
      const detailsForJSON = serviceDataFromForm.serviceDetails.map((detail, idx) => {
        // Quitamos las 'photos' (que son los Files nuevos)
        const { photos, ...restOfDetail } = detail; 
        
        // Usamos la lógica de 'updateServiceModel' para limpiar los 'details'
        const cleanDetails = Object.fromEntries(
          Object.entries(restOfDetail.details || {}).map(([key, value]) => {
            const num = Number(value);
            return [key, isNaN(num) || value === "" ? value : num];
          })
        );

        return {
          ...restOfDetail, // Esto incluye _id (si existe), ref_price, status
          details: cleanDetails, // Los detalles limpios
          detail_number: restOfDetail.detail_number || idx + 1, // Aseguramos detail_number
        };
      });
      formData.append('serviceDetails', JSON.stringify(detailsForJSON));

      // 2. Añadir los archivos NUEVOS
      serviceDataFromForm.serviceDetails.forEach((detail, idx) => {
        const detailNum = detail.detail_number || idx + 1;
        const fieldName = `photos_${detailNum}`;
        
        // 'detail.photos' debe ser el array de *nuevos* objetos File
        if (detail.photos && detail.photos.length > 0) { 
          detail.photos.forEach(file => {
            if (file instanceof File) { // Nos aseguramos que sea un archivo
              formData.append(fieldName, file);
            }
          });
        }
      });

      // 3. Añadir los IDs de las fotos a BORRAR (como string JSON)
      if (serviceDataFromForm.photosToDelete && serviceDataFromForm.photosToDelete.length > 0) {
        formData.append('photos_to_delete', JSON.stringify(serviceDataFromForm.photosToDelete));
      }

      // 4. Llamar a la API PATCH con FormData
      //    (Usamos getAuthConfig2 asumiendo que es la versión corregida)
      await serviceApi.patch(
        `/${id}`, 
        formData, 
        getAuthConfig2(token, true) // isFormData = true
      );
      
      // 5. Lógica de éxito (sin cambios)
      await startFetchServiceById(id); // Re-fetch para tener la data actualizada
      openSnackbar("El servicio fue actualizado exitosamente.");
      return true;
    } catch (error) {
      console.log('Error en updateService:', error);
      const message = error.response?.data?.message;
  openSnackbar("Debe agregar al menos un detalle al servicio.");
      return false;
    } finally {
      dispatch(setLoadingService(false));
    }
  };

  const validateDetails = (details) => {
    if (!details.length) {
  const notifyDetailError = () => openSnackbar("Al menos un detalle debe estar completo.");
      return false;
    }
    for (const detail of details) {
      const hasEmptyField = Object.entries(detail.details).some(
        ([key, value]) =>
          value !== null &&
          value !== undefined &&
          (typeof value === "string" ? value.trim() !== "" : value !== "")
      );
      if (!hasEmptyField) {
  // ...existing code...
        return false;
      }
    }
    return true;
  };

  const setSelectedService = (serviceType) => {
    dispatch(selectedService({ ...serviceType }));
  };

  const setPageGlobal = (page) => {
    dispatch(setPageService(page));
  };

  const setRowsPerPageGlobal = (rows) => {
    dispatch(setRowsPerPageService(rows));
  };

  const handleAddDetail = (append, details) => {
    append({ ref_price: Number(""), details: {}, status: "Activo" });
    setSelectedFields((prev) => ({
      ...prev,
      [details.length]: selectedServiceType?.attributes
        ? [...selectedServiceType.attributes]
        : [],
    }));
  };

  const handleAddFieldToDetail = (idx, field) => {
    setSelectedFields((prev) => ({
      ...prev,
      [idx]: [...(prev[idx] || []), field],
    }));
    setOpenFieldModalIdx(null);
  };

const handleRemoveFieldFromDetail = (detailIdx, fieldIdx, getValues, setValue) => {
  setSelectedFields((prev) => {
    const updatedFields = { ...prev };
    const removedField = updatedFields[detailIdx][fieldIdx];

    // Eliminar del array visual de campos
    updatedFields[detailIdx] = updatedFields[detailIdx].filter((_, idx) => idx !== fieldIdx);

    if (removedField) {
      const currentDetails = getValues(`serviceDetails.${detailIdx}.details`);

      if (currentDetails && currentDetails[removedField.name] !== undefined) {
        // Crear un nuevo objeto para RHF
        const updatedDetails = { ...currentDetails };

        // Eliminar la propiedad del objeto
        delete updatedDetails[removedField.name];

        // Actualizar RHF forzando validación y estado sucio
        setValue(`serviceDetails.${detailIdx}.details`, updatedDetails, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }

    return updatedFields;
  });
};


  return {
    // state global redux
    services,
    selected,
    total,
    loading,
    searchTerm,
    rowsPerPage,
    currentPage,
    orderBy,
    order,

    // state local del hook
    customAttributes,
    setCustomAttributes,
    selectedFields,
    setSelectedFields,
    openFieldModalIdx,
    setOpenFieldModalIdx,
    selectedProvider,
    setSelectedProvider,
    selectedServiceType,
    setSelectedServiceType,

    // setters
    setSearchTerm,
    setOrderBy,
    setOrder,
    setPageGlobal,
    setRowsPerPageGlobal,

    // acciones redux
    startCreateService,
    startLoadingServicePaginated,
    startUpdateService,
    setSelectedService,
    startLoadingAllServices,

    // gestión de detalles y campos dinámicos
    handleAddDetail,
    handleAddFieldToDetail,
    handleRemoveFieldFromDetail,
  };
};
