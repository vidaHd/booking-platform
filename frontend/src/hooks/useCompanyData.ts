import { useApiQuery } from "../api/apiClient";

export const useCompanyData = (url: string | undefined) => {
  // find company
  const { data: companyData } = useApiQuery<any>({
    key: ["url-company"],
    url: `/companies/url/${url}`,
    enabled: !!url,
  });

  const companyId = companyData?.data?._id;

  const { data: companyTimes } = useApiQuery<any>({
    key: ["company-times", companyId],
    url: companyId ? `/companies/${companyId}/times/` : "",
    enabled: !!companyId,
  });

  return { companyData, companyId, companyTimes };
};
