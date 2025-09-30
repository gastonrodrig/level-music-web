import axios from "axios";
import { baseURL } from "../../shared/helpers";

export const assignationsApi = axios.create({
  baseURL: `${baseURL}/assignations`,
});
