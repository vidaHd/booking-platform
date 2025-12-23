export interface Props {
  service: ServiceItem;
  isEditing: boolean;
  editValues: { price: string; duration: string };
  setEditValues: React.Dispatch<React.SetStateAction<{ price: string; duration: string }>>;
  onEdit: (service: ServiceItem) => void;
  onSave: (service: ServiceItem) => void;
  onCancel: () => void;
  onDelete: (id: string, title?: string) => void;
}

export interface ServiceItem {
  serviceId: string;
  companyId: string;
  title: string;
  price?: string;
  duration?: string;
}
export interface SelectService {
  companyId: string;
  duration: string;
  price: string;
  serviceId: string;
  title: string;
}
export interface ServiceItem {
  serviceId: string;
  companyId: string;
  title: string;
  price?: string;
  duration?: string;
  concurrentCapability?: boolean;
}
export type CompanyApiResponse = {
  data: {
    _id: string;
    companyName: string;
    phone?: string;
    address?: string;
    email?: string;
    description?: string;
    url?: string;
  };
};
export interface CompanyData {
  companyName: string;
  mobileNumber?: string;
  address?: string;
  email?: string;
  description?: string;
  url?: string;
}
