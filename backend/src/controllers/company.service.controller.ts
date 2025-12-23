import { Request, Response } from "express";
import { serviceService } from "../services/service.service";
import { CompanyServices } from "../services/companyService.service";
import { asyncHandler, successResponse } from "../helpers/response.helper";

export const serviceController = {
  createUserService: asyncHandler(async (req: Request, res: Response) => {
    const { companyId, serviceId, price, duration } = req.body;

    const newService = await CompanyServices.createService({
      price,
      duration,
      serviceId,
      companyId,
    });

    successResponse(res, "Service created successfully", { data: newService });
  }),

  getAllServicesByCompanyId: asyncHandler(
    async (req: Request, res: Response) => {
      const { companyId } = req.params;

      const userServices = await CompanyServices.getAllServicesByCompanyId(
        companyId
      );
      const services = await serviceService.getServices({
        ids: userServices.map((us: any) => us.serviceId),
      });

      const response = userServices.map((us: any) => ({
        price: us.price ?? "Contact us",
        duration: us.duration ?? "Contact us",
        serviceId: us.serviceId,
        concurrentCapability: us.concurrentCapability,
        companyId: us.companyId,
        title: services.find((s) => s._id.toString() === us.serviceId)?.title,
      }));

      successResponse(res, "Services fetched successfully", { data: response });
    }
  ),

  updateService: asyncHandler(async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const { serviceId, price, duration, concurrentCapability } = req.body;

    if (!companyId || !serviceId) {
      throw new Error("companyId and serviceId are required");
    }

    const updated = await CompanyServices.updateService(
      serviceId,
      companyId,
      price,
      duration,
      concurrentCapability
    );

    successResponse(res, "Service updated successfully", { data: updated });
  }),

  updateUserServicesBulk: asyncHandler(async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const { serviceIds } = req.body;

    const updatedServices = await CompanyServices.updateServicesBulk(
      companyId,
      serviceIds
    );

    successResponse(res, "Services updated successfully", {
      data: updatedServices,
    });
  }),

  deleteUserService: asyncHandler(async (req: Request, res: Response) => {
    const { serviceId, companyId } = req.params;
    await CompanyServices.deleteService(serviceId, companyId);

    successResponse(res, "Service deleted successfully");
  }),
};
