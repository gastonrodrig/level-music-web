import axios from 'axios'
import { baseURL } from '../../shared/helpers';

export const eventTypeApi = axios.create({
  baseURL: `${baseURL}/event-type`,
});