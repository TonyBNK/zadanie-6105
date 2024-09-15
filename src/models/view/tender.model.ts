import { TenderServiceType, TenderStatus } from "../../types";

export type TenderViewModel = {
  id: string;
  name: string;
  description: string;
  serviceType: TenderServiceType;
  status: TenderStatus;
  version: number;
  createdAt: string;
};
