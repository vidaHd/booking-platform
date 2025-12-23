export interface IUserService extends Document {
  price?: string;
  duration?: string;
  serviceId: string;
  companyId: string;
  concurrentCapability?: boolean;
}
