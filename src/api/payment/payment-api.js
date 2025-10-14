import axios from 'axios'
import { baseURL } from '../../shared/helpers';

export const paymentApi = axios.create({
  baseURL: `${baseURL}/payments`,
});