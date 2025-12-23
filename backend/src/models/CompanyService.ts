import { Schema, model } from "mongoose";
import { IUserService } from "../types/ICompanyService";

const companyServiceSchema = new Schema<IUserService>({
  price: { type: String, required: false },
  duration: { type: String, required: false },
  concurrentCapability: { type: Boolean, required: false },
  serviceId: { type: String, required: true },
  companyId: { type: String, required: true },
});

export const CompanyService = model<IUserService>(
  "companyService",
  companyServiceSchema
);
