import { Schema, model, Document } from "mongoose";
import { IService } from "../types/IService";


const jobService = new Schema<IService>({
  title: { type: String, required: true },
  jobId: { type: String, required: true },
});

export const Service = model<IService>("Service", jobService);
