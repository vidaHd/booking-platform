import express from "express";
import { serviceController } from "../controllers/service.controller";
import { validationMiddleware } from "../middleware";
import { CreateServiceDto } from "../dto/service.dto";

const router = express.Router();

/**
 * Create a new service
 */
router.post("/services", validationMiddleware(CreateServiceDto), serviceController.createService);

/**
 * Get all services related to a specific job
 */
router.get("/services/job/:jobId", serviceController.getAllServicesByJobId);

export default router;
