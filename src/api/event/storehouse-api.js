import axios from "axios";
import { baseURL } from "../../shared/helpers";

export const storehouseMovementApi = axios.create({
  baseURL: `${baseURL}/storehouse-movement`,
});