import axios from "axios";
import { baseURL } from "../../shared/helpers";

export const appointmentsApi = axios.create({
  baseURL: `${baseURL}/appointments`,
});
