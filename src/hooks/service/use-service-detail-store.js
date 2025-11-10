import { useDispatch, useSelector } from "react-redux";
import {
  listAllServiceDetails,
  setLoadingServiceDetail,
  selectedServiceDetail,
  showSnackbar,
} from "../../store";
import { serviceDetailApi } from "../../api";
import { getAuthConfig } from "../../shared/utils";

export const useServiceDetailStore = () => {
  const dispatch = useDispatch();
  const {
    serviceDetail,
    selected,
    loading,
  } = useSelector((state) => state.serviceDetail);

  const { token } = useSelector((state) => state.auth);

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startLoadingAllServiceDetails = async () => {
    dispatch(setLoadingServiceDetail(true));
    try {
      const { data } = await serviceDetailApi.get("/all", getAuthConfig(token));
      dispatch(listAllServiceDetails(data));
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al cargar los detalles del servicio.");
      return false;
    } finally {
      dispatch(setLoadingServiceDetail(false));
    }
  };

  const setSelectedServiceDetail = (serviceDetail) => {
    dispatch(selectedServiceDetail(serviceDetail));
  }

  return {
    //state
    serviceDetail,
    selected,
    loading,

    //acciones
    setSelectedServiceDetail,
    startLoadingAllServiceDetails,
  };
};