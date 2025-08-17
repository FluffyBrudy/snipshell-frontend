import { AxiosResponse } from "axios";

export interface GenericAxiosError {
  data: AxiosResponse["data"];
  statusText: AxiosResponse["statusText"];
  status: AxiosResponse["status"];
}
