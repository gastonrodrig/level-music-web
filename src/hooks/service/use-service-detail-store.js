import { useDispatch, useSelector } from "react-redux";
import { listAllServiceDetails, setLoadingServiceDetail } from "../../store";
import { listAllSeviceDetails } from "../../store";
import { serviceDetailApi } from "../../api";

export const useServiceDetailStore = () => {
  const dispatch = useDispatch();
  const {
    serviceDetail,
    loading,
  } = useSelector((state) => state.serviceDetail);

  const { token } = useSelector((state) => state.auth);

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

  return {
    //state
    serviceDetail,
    loading,

    //acciones
    startLoadingAllServiceDetails,
  };
};



      // Implement API call to load service details her