import { useApiQuery, useApiMutation } from "../api/apiClient";

export const useBookings = (companyId?: string, userId?: string, selectedDate?: string) => {
  //get all booking by this company

  const { data: allBookings, refetch: refreshAllBooking } = useApiQuery<any>({
    key: ["all-bookings", companyId],
    url: companyId ? `/bookings/${companyId}` : "",
    enabled: !!companyId,
  });

  // check time by date
  const { data: companyBookings, refetch: refetchCompanyBookings } = useApiQuery<any>({
    key: ["company-bookings", companyId, selectedDate],
    url: companyId && selectedDate ? `/bookings/${companyId}/${selectedDate}` : "",
    enabled: !!companyId && !!selectedDate,
  });

  //get reserv time just for specific user
  const { data: userBookings, refetch: refreshUserBookings } = useApiQuery<any>({
    key: ["user-bookings", companyId, userId],
    url: companyId && userId ? `/bookings/reserveTime/${companyId}/${userId}` : "",
    enabled: !!companyId && !!userId,
  });

  const createBooking = useApiMutation<any, { serviceId: string; date: string; time: string }>({
    url: companyId && userId ? `/bookings/${companyId}/${userId}` : "",
    method: "POST",
  });

  return {
    allBookings,
    companyBookings,
    userBookings,
    refetchCompanyBookings,
    refreshAllBooking,
    refreshUserBookings,
    createBooking,
  };
};
