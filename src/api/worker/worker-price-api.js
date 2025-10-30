import axios from 'axios';
import { baseURL } from '../../shared/helpers';

export const workerPriceApi = axios.create({
  baseURL: `${baseURL}/worker-prices`,
});
