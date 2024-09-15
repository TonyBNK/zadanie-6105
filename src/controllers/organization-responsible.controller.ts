import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../constants";
import organizationResponsibleQueryRepository from "../query-repositories/organization-responsible.query-repository";
import organizationResponsibleRepository from "../repositories/organization-responsible.repository";

class OrganizationResponsibleController {
  async createOrganizationResponsible(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const organizationResponsible =
        await organizationResponsibleRepository.createOrganizationResponsible(
          req.body
        );

      res.status(HttpStatusCode.Success).send(organizationResponsible);
    } catch (error) {
      next(error);
    }
  }

  async getAllOrganizationResponsibles(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const organizationResponsibles =
        await organizationResponsibleQueryRepository.getAllOrganizationResponsibles();

      res.status(HttpStatusCode.Success).send(organizationResponsibles);
    } catch (error) {
      next(error);
    }
  }

  async deleteOrganizationResponsible(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await organizationResponsibleRepository.deleteOrganizationResponsible(
        req.params.id
      );

      res.sendStatus(HttpStatusCode.NoContent);
    } catch (error) {
      next(error);
    }
  }
}

export default new OrganizationResponsibleController();
