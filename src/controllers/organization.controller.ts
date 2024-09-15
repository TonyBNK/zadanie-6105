import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../constants";
import organizationQueryRepository from "../query-repositories/organization.query-repository";
import organizationRepository from "../repositories/organization.repository";

class OrganizationController {
  async createOrganization(req: Request, res: Response, next: NextFunction) {
    try {
      const organization = await organizationRepository.createOrganization(
        req.body
      );

      res.status(HttpStatusCode.Success).send(organization);
    } catch (error) {
      next(error);
    }
  }

  async getAllOrganizations(req: Request, res: Response, next: NextFunction) {
    try {
      const organizations =
        await organizationQueryRepository.getAllOrganizations();

      res.status(HttpStatusCode.Success).send(organizations);
    } catch (error) {
      next(error);
    }
  }

  async deleteOrganization(req: Request, res: Response, next: NextFunction) {
    try {
      await organizationRepository.deleteOrganization(req.params.id);

      res.sendStatus(HttpStatusCode.NoContent);
    } catch (error) {
      next(error);
    }
  }
}

export default new OrganizationController();
