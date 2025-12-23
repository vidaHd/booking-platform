import { useQuery, useMutation } from "@tanstack/react-query";
import type { UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { getItem } from "../utils/storage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type FetcherParams = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
};

export const fetcher = async ({ url, method = "GET", body }: FetcherParams) => {
  const token = (getItem<string>("token") as string) || "";
  const isFormData = body instanceof FormData;
  const language = (getItem<string>("language") as string) || "fa";

  const res = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
      "Accept-Language": language,
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  if (!res.ok) {
    let errorMessage = `Error ${res.status}`;
    try {
      const data = await res.json();
      errorMessage = data.error || data.message || errorMessage;
    } catch {
      const text = await res.text();
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  return res.json();
};

export const useApiQuery = <T>({
  key,
  url,
  method = "GET",
  body,
  options,
  enabled = true,
}: {
  key: string | unknown[];
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  options?: any;
  enabled?: boolean;
}) => {
  return useQuery<T, Error>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: () => fetcher({ url, method, body }),
    enabled,
    ...options,
  });
};

export const useApiMutation = <T, U>({
  url,
  method = "POST",
  options,
}: {
  url: string;
  method?: "POST" | "PUT" | "DELETE";
  options?: UseMutationOptions<T, string, U>;
}): UseMutationResult<T, string, U> => {
  return useMutation<T, string, U>({
    mutationFn: (body: U) => fetcher({ url, method, body }),
    ...options,
  });
};
