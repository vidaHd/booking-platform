import { useApiMutation, useApiQuery } from "../api/apiClient";
import { showNotification } from "../utils/showNotification";
import { useTranslation } from "react-i18next";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useServices = (companyId: string) => {
  const { t } = useTranslation();

  //get service by specific company

  const { data: servicesByCompany, refetch } = useApiQuery<any>({
    key: ["all-service", companyId],
    url: `/company-service/${companyId}`,
  });

  const update = useApiMutation<
    any,
    {
      serviceId: string;
      companyId: string;
      price: string;
      duration: string;
      concurrentCapability: boolean;
    }
  >({
    url: `/update-service/${companyId}`,
    method: "PUT",
    options: {
      onSuccess: (data) => {
        refetch();
        showNotification(data.messages, "success");
      },
      onError: (error) => {
        showNotification(error, "error");
      },
    },
  });

  const remove = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/delete-service/${id}/${companyId}`, {
        method: "DELETE",
      });
      refetch();
      showNotification(t("notification.deleteSuccess"), "success");
    } catch (error) {
      showNotification(t("notification.deleteError"), "error");
    }
  };

  return { servicesByCompany, update, remove };
};
