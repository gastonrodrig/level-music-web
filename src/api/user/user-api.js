import axios from 'axios';
import { baseURL } from '../../shared/helpers';

export const userApi = axios.create({
  baseURL: `${baseURL}/user`,
  // headers: {
  //   'ngrok-skip-browser-warning': 'true'
  // }
});
