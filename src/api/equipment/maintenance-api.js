import axios from 'axios'
import { baseURL } from '../../shared/helpers';

export const maintenanceApi = axios.create({
  baseURL: `${baseURL}/maintenance`,
});