import axios from 'axios';
import { baseURL } from '../../shared/helpers';

export const workerApi = axios.create({
  baseURL: `${baseURL}/workers`,
  // headers: {
  //   'ngrok-skip-browser-warning': 'true'
  // }
});
