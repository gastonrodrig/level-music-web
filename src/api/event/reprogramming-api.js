import axios from "axios";
import { baseURL } from "../../shared/helpers";

export const reprogrammingApi = axios.create({
  baseURL: `${baseURL}/reprogramings`,
});