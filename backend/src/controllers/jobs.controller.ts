import { Request, Response } from "express";
import { Job } from "../models/Job";
import { asyncHandler, successResponse } from "../helpers/response.helper";

export const jobController = {
  getJobs: asyncHandler(async (req: Request, res: Response) => {
    const jobList = await Job.find();
    successResponse(res, "Jobs fetched successfully", { data: jobList });
  }),
};
