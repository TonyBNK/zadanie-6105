import { TenderServiceType, TenderStatus } from "../../types";

export type CreateTenderInputModel = {
  name: string;
  description: string;
  serviceType: TenderServiceType;
  status: TenderStatus;
  organizationId: string;
  creatorUsername: string;
};

export type TenderInputForDB = CreateTenderInputModel & {
  id: string;
  createdAt: Date;
  version: number;
};

export type UpdateTenderStatusInputModel = {
  tenderId: string;
  status: TenderStatus;
  username: string;
};

export type GetAllTendersQueryParams = {
  service_type?: TenderServiceType;
  limit?: number;
  offset?: number;
};

export type GetUserTendersQueryParams = {
  username?: string;
  limit?: number;
  offset?: number;
};

export type GetTenderStatusQueryParams = {
  username: string;
};

export type UpdateTenderStatusQueryParams = {
  username: string;
  status: TenderStatus;
};

export type UpdateTenderBody = {
  name?: string;
  description?: string;
  serviceType?: TenderServiceType;
};

export type UpdateTenderInputModel = {
  tenderId: string;
  username: string;
  payload: UpdateTenderBody;
};

export type CreateTenderVersionInputModel = {
  id: string;
  tenderId: string;
  name: string;
  description: string;
  serviceType: TenderServiceType;
  version: number;
  createdAt: Date;
};

export type RollbackTenderParams = {
  tenderId: string;
  version: number;
};

export type RollbackTenderInputModel = RollbackTenderParams & {
  username: string;
};
