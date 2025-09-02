import axios from 'axios'
import { baseURL } from '../../shared/helpers';

export const eventApi = axios.create({
  baseURL: `${baseURL}/events`,
  // headers: {
  //   'ngrok-skip-browser-warning': 'true'
  // }
});