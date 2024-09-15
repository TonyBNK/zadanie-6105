import { Request } from "express";

export enum TenderStatus {
  Created = "Created",
  Published = "Published",
  Closed = "Closed",
}

export enum TenderServiceType {
  Construction = "Construction",
  Delivery = "Delivery",
  Manufacture = "Manufacture",
}

export enum BidStatus {
  Created = "Created",
  Published = "Published",
  Closed = "Closed",
  Approved = "Approved",
  Rejected = "Rejected",
}

export enum BidAuthorType {
  Organization = "Organization",
  User = "User",
}

export type RequestWithParams<P> = Request<P>;
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type RequestWithBody<B> = Request<{}, {}, B>;
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B>;
export type RequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>;
export type RequestWithParamsAndQueryAndBody<P, Q, B> = Request<P, {}, B, Q>;
