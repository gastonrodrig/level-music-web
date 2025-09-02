import axios from 'axios'
import { baseURL } from '../../shared/helpers';

export const eventFeaturedApi = axios.create({
  baseURL: `${baseURL}/featured-events`,
  // headers: {
  //   'ngrok-skip-browser-warning': 'true'
  // }
});