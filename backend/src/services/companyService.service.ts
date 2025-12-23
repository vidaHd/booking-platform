import { CompanyService } from "../models/CompanyService";

export const CompanyServices = {
  async createService(data: {
    price: string;
    duration: string;
    serviceId: string;
    companyId: string;
  }) {
    const newService = new CompanyService(data);
    return await newService.save();
  },

  async getAllServicesByCompanyId(companyId: string) {
    return await CompanyService.find({ companyId });
  },

  async getServiceByCompanyAndId(serviceId: string, companyId: string) {
    return await CompanyService.findOne({ serviceId, companyId }).exec();
  },

  async updateService(
    serviceId: string,
    companyId: string,
    price?: string,
    duration?: string,
    concurrentCapability?: boolean
  ) {
    return await CompanyService.findOneAndUpdate(
      { serviceId, companyId },
      { price, duration, concurrentCapability },
      { new: true }
    ).exec();
  },

  async updateServicesBulk(companyId: string, serviceIds: string[]) {
    const results = await Promise.all(
      serviceIds.map(async (serviceId) => {
        const existing = await CompanyService.findOne({ serviceId, companyId });
        if (existing) {
          Object.assign(existing);
          return await existing.save();
        } else {
          const newService = new CompanyService({
            serviceId,
            companyId,
          });
          return await newService.save();
        }
      })
    );
    return results;
  },

  async deleteService(serviceId: string, companyId: string) {
    return await CompanyService.findOneAndDelete({
      serviceId,
      companyId,
    }).exec();
  },
};
