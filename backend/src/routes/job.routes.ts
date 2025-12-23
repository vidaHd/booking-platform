import express from "express";
import { jobController } from "../controllers/jobs.controller";

const router = express.Router();

/**
 * Get all available jobs
 */
router.get("/jobs", jobController.getJobs);

export default router;
