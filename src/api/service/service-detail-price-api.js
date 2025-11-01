import axios from 'axios';
import { baseURL } from '../../shared/helpers';

export const serviceDetailPriceApi = axios.create({
  baseURL: `${baseURL}/service-details-prices`,
});