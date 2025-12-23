import { Company } from "../models/Company";
import { CompanyService } from "../models/CompanyService";

export const companyService = {
  async createCompany(data: {
    companyName: string;
    userId: string;
    jobId?: string;
    url: string;
  }) {
    const newCompany = new Company(data);
    return await newCompany.save();
  },

  async getCompanyById(companyId: string) {
    return await Company.findById(companyId);
  },

  async getAllCompanies() {
    return await Company.find();
  },

  async getAllCompaniesByUserId(userId: string) {
    return await Company.find({ userId }).exec();
  },

  async updateCompany(
    companyId: string,
    data: Partial<{
      companyName: string;
      url: string;
      mobileNumber: string;
      address: string;
      email: string;
      description: string;
    }>
  ) {
    return await Company.findByIdAndUpdate(companyId, data, { new: true });
  },

  async deleteCompany(companyId: string) {
    return await Company.findByIdAndDelete(companyId);
  },

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
    return await CompanyService.find({ companyId }).exec();
  },

  async getServiceByCompanyAndId(serviceId: string, companyId: string) {
    return await CompanyService.findOne({ serviceId, companyId }).exec();
  },

  async updateService(
    serviceId: string,
    companyId: string,
    price?: string,
    duration?: string
  ) {
    const updateData: any = {};
    if (price !== undefined) updateData.price = price;
    if (duration !== undefined) updateData.duration = duration;

    return await CompanyService.findOneAndUpdate(
      { serviceId, companyId },
      updateData,
      { new: true }
    ).exec();
  },

  async deleteService(serviceId: string, companyId: string) {
    return await CompanyService.findOneAndDelete({
      serviceId,
      companyId,
    }).exec();
  },

  async getCompanyByUrl(url: any) {
    return await Company.findOne({ url }).exec();
  },
};
