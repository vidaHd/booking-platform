import { Types } from "mongoose";
import { Service } from "../models/Service";
import { IService } from "../types/IService";

export const serviceService = {
  async createService(data: { title: string; jobId: string }) {
    const newService = new Service({ ...data });
    return await newService.save();
  },

  async getAllServicesByJobId(jobId: string) {
    return await Service.find({ jobId });
  },

  async getServicesByServiceId(id: string) {
    return await Service.find({ id });
  },

  async getServices(
    filter: { jobId?: string; ids?: string[] } = {}
  ): Promise<IService[]> {
    const query: any = {};

    if (filter.jobId) {
      query.jobId = filter.jobId;
    }

    if (filter.ids && Array.isArray(filter.ids) && filter.ids.length > 0) {
      query._id = { $in: filter.ids.map((id) => new Types.ObjectId(id)) };
    }

    return await Service.find(query);
  },

  async getServiceById(id: string): Promise<IService | null> {
    return await Service.findById(id).exec();
  },

  // Update a service by ID
  async updateService(
    id: string,
    data: Partial<{ title: string; jobId: string }>
  ): Promise<IService | null> {
    return await Service.findByIdAndUpdate(id, data, { new: true }).exec();
  },

  // Delete a service by ID
  async deleteService(id: string): Promise<IService | null> {
    return await Service.findByIdAndDelete(id).exec();
  },
};
