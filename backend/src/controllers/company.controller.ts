import { Request, Response } from "express";
import { companyService } from "../services/company.service";
import { asyncHandler, successResponse } from "../helpers/response.helper";

function generateRandomUrl(length = 8) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const companyController = {
  addCompany: asyncHandler(async (req: any, res: Response) => {
    const { companyName, jobId } = req.body;
    const { userId } = req.params;

    const url = `${companyName
      .toLowerCase()
      .replace(/\s+/g, "-")}-${generateRandomUrl(4)}`;

    const newCompany = await companyService.createCompany({
      companyName,
      jobId,
      userId,
      url,
    });
    await newCompany.save();

    successResponse(res, "Company created successfully", {
      data: newCompany.toObject(),
    });
  }),
  getAllCompaniesByUserId: asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const companies = await companyService.getAllCompaniesByUserId(userId);
    successResponse(res, "Companies fetched successfully", { data: companies });
  }),
  getAllCompanies: asyncHandler(async (_req: Request, res: Response) => {
    const companies = await companyService.getAllCompanies();
    successResponse(res, "Companies fetched successfully", { data: companies });
  }),

  getCompanyById: asyncHandler(async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const company = await companyService.getCompanyById(companyId);
    successResponse(res, "Company fetched successfully", { data: company });
  }),

  updateCompany: asyncHandler(async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const { companyName, url, mobileNumber, address, email, description } =
      req.body;

    const updated = await companyService.updateCompany(companyId, {
      companyName,
      url,
      mobileNumber,
      address,
      email,
      description,
    });

    successResponse(res, "Company updated successfully", { data: updated });
  }),

  deleteCompany: asyncHandler(async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const deleted = await companyService.deleteCompany(companyId);
    successResponse(res, "Company deleted successfully");
  }),

  getCompanyByUrl: asyncHandler(async (req: Request, res: Response) => {
    const { url } = req.params;
    const company = await companyService.getCompanyByUrl(url);
    successResponse(res, "Company fetched successfully", { data: company });
  }),
};
