import { Request, Response } from "express";
import { timeService } from "../services/time.service";
import { successResponse, asyncHandler } from "../helpers/response.helper";

export const addOrUpdateAvailableTimes = asyncHandler(
  async (req: Request, res: Response) => {
    const { companyId, timesByDay } = req.body;

    const result = await timeService.addOrUpdateAvailableTimesBulk(
      companyId,
      timesByDay
    );

    successResponse(res, req.t("time.update_success"), { data: result });
  }
);

export const getTimeByCompanyAndDay = asyncHandler(
  async (req: Request, res: Response) => {
    const { companyId, day } = req.params;

    const time = await timeService.getByCompanyAndDay(companyId, day);

    successResponse(res, req.t("time.success"), { data: time });
  }
);

export const getAllTimesByCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const { companyId } = req.params;

    const timesByDay = await timeService.getAllByCompany(companyId);
    successResponse(res, req.t("time.success"), { data: timesByDay });
  }
);

export const getAllTimes = asyncHandler(
  async (_req: Request, res: Response) => {
    const times = await timeService.getAll();
    successResponse(res, _req.t("time.success"), { data: times });
  }
);
