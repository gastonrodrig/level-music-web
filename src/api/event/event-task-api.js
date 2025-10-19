import axios from 'axios'
import { baseURL } from '../../shared/helpers';

export const EventTaskApi = axios.create({
  baseURL: `${baseURL}/event-tasks`,
});



