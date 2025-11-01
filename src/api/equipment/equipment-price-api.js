import axios from 'axios';
import { baseURL } from '../../shared/helpers';

export const equipmentPriceApi = axios.create({
  baseURL: `${baseURL}/equipment-prices`,
});
