import { Request, Response } from "express";
import { serviceService } from "../services/service.service";
import { asyncHandler, successResponse } from "../helpers/response.helper";

export const serviceController = {
  createService: asyncHandler(async (req: Request, res: Response) => {
    const { title, jobId } = req.body;

    const newService = await serviceService.createService({ title, jobId });
    await newService.save();

    successResponse(res, "Service created successfully", {
      ...newService.toObject(),
      _id: newService._id,
    });
  }),

  getAllServicesByJobId: asyncHandler(async (req: Request, res: Response) => {
    const { jobId } = req.params;
    const services = await serviceService.getAllServicesByJobId(jobId);

    successResponse(res, "Services fetched successfully", { data: services });
  }),

  getServiceById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const service = await serviceService.getServicesByServiceId(id);

    successResponse(res, "Service fetched successfully", { data: service });
  }),
};
