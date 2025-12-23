import express from "express";
import { serviceController } from "../controllers/company.service.controller";
import { validationMiddleware } from "../middleware";
import {
  BulkUpdateCompanyServiceDto,
  CreateCompanyServiceDto,
  UpdateCompanyServiceDto,
} from "../dto/company-service.dto";

const router = express.Router();

/**
 * Create a new service for a company
 * @access Private
 */
router.post(
  "/create-company-service",
  validationMiddleware(CreateCompanyServiceDto),
  serviceController.createUserService
);

/**
 *
 * Get all services for a specific company
 */
router.get(
  "/company-service/:companyId",
  serviceController.getAllServicesByCompanyId
);

/**
 * Update multiple services for a company in bulk
 */
router.put(
  "/company-service/bulk/:companyId",
  validationMiddleware(BulkUpdateCompanyServiceDto),
  serviceController.updateUserServicesBulk
);

/**
 * Update a single service of a company
 */
router.put(
  "/update-service/:companyId",
  validationMiddleware(UpdateCompanyServiceDto),
  serviceController.updateService
);

/**
 * Delete a specific service of a company
 */
router.delete(
  "/delete-service/:serviceId/:companyId",
  serviceController.deleteUserService
);

export default router;
