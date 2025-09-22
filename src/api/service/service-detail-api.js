import axios from 'axios';
import { baseURL } from '../../shared/helpers';

export const serviceDetailApi = axios.create({
  baseURL: `${baseURL}/service-details`,
  // headers: {
  //   'ngrok-skip-browser-warning': 'true'
  // }
});