
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
import { getAuthConfig, getAuthConfigWithParams } from "../../shared/utils";

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

  const MAX_FILES = 5;
  const MAX_TOTAL_SIZE = 20 * 1024 * 1024;

  const startCreateService = async (serviceDataFromForm) => {
    if (!validateDetails(serviceDataFromForm.serviceDetails)) return false;
    if (!validateFiles(serviceDataFromForm.serviceDetails)) return false;
    dispatch(setLoadingService(true));
    try {
      const formData = createServiceModel(serviceDataFromForm);
      await serviceApi.post("", formData, getAuthConfig(token, true));
      openSnackbar("El servicio fue creado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al crear el servicio.");
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
      openSnackbar(message ?? "Ocurrió un error al cargar los servicios.");
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
      openSnackbar(message ?? "Ocurrió un error al cargar.");
      return false;
    } finally {
      dispatch(setLoadingService(false));
    }
  };

  const startUpdateService = async (id, serviceDataFromForm) => {
    if (!validateDetails(serviceDataFromForm.serviceDetails)) return false;
    if (!validateFiles(serviceDataFromForm.serviceDetails)) return false;
    dispatch(setLoadingService(true));
    try {
      const formData = updateServiceModel(serviceDataFromForm);
      await serviceApi.patch(`/${id}`, formData, getAuthConfig(token, true));
      openSnackbar("El servicio fue actualizado exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Debe agregar al menos un detalle al servicio.");
      return false;
    } finally {
      dispatch(setLoadingService(false));
    }
  };

  const validateDetails = (details) => {
    if (!details.length) {
      openSnackbar("Debe agregar al menos un detalle al servicio.");
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
        openSnackbar("Al menos un detalle debe estar completo.");
        return false;
      }
    }
    return true;
  };

  const validateFiles = (details) => {
    let totalFiles = 0;
    let totalSize = 0;

    for (const detail of details) {
      const files = detail.photos || [];
      totalFiles += files.length;
      totalSize += files.reduce((acc, f) => acc + (f?.size || 0), 0);

      if (files.length > MAX_FILES) {
        openSnackbar(`Máximo ${MAX_FILES} imágenes por detalle.`);
        return false;
      }
    }

    if (totalSize > MAX_TOTAL_SIZE) {
      openSnackbar("El tamaño total de las imágenes no debe superar los 20 MB.");
      return false;
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
      updatedFields[detailIdx] = updatedFields[detailIdx].filter((_, idx) => idx !== fieldIdx);

      if (removedField) {
        const currentDetails = getValues(`serviceDetails.${detailIdx}.details`);
        if (currentDetails && currentDetails[removedField.name] !== undefined) {
          const updatedDetails = { ...currentDetails };
          delete updatedDetails[removedField.name];

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
