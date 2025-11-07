import { createSlice } from '@reduxjs/toolkit';
import { serviceDetailPriceApi } from '../../api/service';

const initialState = {
  prices: [],
  loading: false,
  error: null,
};

export const serviceDetailPriceSlice = createSlice({
  name: 'serviceDetailPrice',
  initialState,
  reducers: {
    setPrices(state, action) {
      state.prices = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setPrices, setLoading, setError } = serviceDetailPriceSlice.actions;
export default serviceDetailPriceSlice.reducer;

// Thunks
export const startLoadingPrices = (detailId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await serviceDetailPriceApi.get(`/by-detail/${detailId}`);
    dispatch(setPrices(data));
    dispatch(setError(null));
  } catch (err) {
    dispatch(setPrices([]));
    dispatch(setError('Error al cargar precios.'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const startCreatePrice = ({ detailId, reference_price }) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await serviceDetailPriceApi.post(`/`, { detail_id: detailId, reference_price });
    dispatch(startLoadingPrices(detailId));
  } catch (err) {
    dispatch(setError('Error al crear precio.'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const startCloseCurrentPrice = (priceId) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    await serviceDetailPriceApi.patch(`/close/${priceId}`);
    // Busca el detailId actual en el store
    const { prices } = getState().serviceDetailPrice;
    const current = prices.find((p) => p._id === priceId);
    if (current && current.detail_id) {
      dispatch(startLoadingPrices(current.detail_id));
    }
  } catch (err) {
    dispatch(setError('Error al cerrar precio.'));
  } finally {
    dispatch(setLoading(false));
  }
};
