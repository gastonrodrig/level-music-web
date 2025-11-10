import { useDispatch, useSelector } from 'react-redux';
import { eventApi } from '../../api';
import {
  setLoadingEvent,
  showSnackbar,
} from '../../store';
import { getAuthConfig } from '../../shared/utils';

export const useEventStore = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.event);

  const { token } = useSelector((state) => state.auth);

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startSendingPurchaseOrder = async (eventId) => {
    dispatch(setLoadingEvent(true));
    try {
      await eventApi.get(`${eventId}/send-provider-mails`, getAuthConfig(token));
      openSnackbar("Las órdenes de compra fueron enviadas exitosamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al enviar las órdenes de compra.");
      return false;
    } finally {
      dispatch(setLoadingEvent(false));
    }
  }

  const startSearchingEvent = async (code) => {
    try {
      const { data } = await eventApi.get(`/code/${code}`, getAuthConfig(token));
      return { data, ok: true };
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al buscar el evento.");
      return false;
    }
  };

  return {
    // state
    loading,

    // actions
    startSendingPurchaseOrder,
    startSearchingEvent,
  };
};