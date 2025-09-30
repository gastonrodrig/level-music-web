import axios from 'axios'
import { baseURL } from '../../shared/helpers';

export const equipmentApi = axios.create({
  baseURL: `${baseURL}/equipments`,
});