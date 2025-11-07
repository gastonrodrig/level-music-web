import { useDispatch, useSelector } from 'react-redux';
import {
  startLoadingPrices,
  startCreatePrice,
  startCloseCurrentPrice,
} from '../../store/service/service-detail-price-slice';

export const useServiceDetailPriceStore = () => {
  const dispatch = useDispatch();
  const { prices, loading, error } = useSelector((state) => state.serviceDetailPrice);

  return {
    prices,
    loading,
    error,
    startLoadingPrices: (detailId) => dispatch(startLoadingPrices(detailId)),
    startCreatePrice: (payload) => dispatch(startCreatePrice(payload)),
    startCloseCurrentPrice: (priceId) => dispatch(startCloseCurrentPrice(priceId)),
  };
};
