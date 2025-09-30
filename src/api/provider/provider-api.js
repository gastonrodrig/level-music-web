import axios from 'axios'
import { baseURL } from '../../shared/helpers';

export const providerApi = axios.create({
  baseURL: `${baseURL}/providers`,
});