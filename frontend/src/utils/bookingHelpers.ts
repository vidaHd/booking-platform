import type DateObject from "react-date-object";

export const getFormattedDate = (date: DateObject) => date.format("YYYY-MM-DD");
export const mapUserBookings = (bookings: any[], userId: string) => {
  return bookings.reduce((acc: Record<string, { date: string; time: string }>, booking: any) => {
    if (booking.userId === userId) {
      acc[booking.serviceId] = {
        date: booking.selectedDate,
        time: booking.selectedTimes[0],
      };
    }
    return acc;
  }, {});
};

export const getTimeStatus = (
  time: string,
  selectedDate: DateObject,
  {
    availableTimes,
    bookedTimes,
    userBookings,
    selectedService,
    selectedTimes,
  }: {
    availableTimes: string[];
    bookedTimes: string[];
    userBookings: any[];
    selectedService: string | null;
    selectedTimes: Record<string, { date: string; time: string; userId?: string }>;
  }
) => {
  const formattedDate = getFormattedDate(selectedDate);

  const isAvailable = availableTimes.includes(time);
  const isBookedByOthers = bookedTimes.includes(time);

  const userBooking = userBookings?.find(
    (b: any) => b.selectedTimes.includes(time) && b.selectedDate === formattedDate
  );

  const isActive =
    selectedService &&
    selectedTimes[selectedService]?.date === formattedDate &&
    selectedTimes[selectedService]?.time === time;

  return { formattedDate, isAvailable, isBookedByOthers, userBooking, isActive };
};

export const toPersianNumber = (num: string | number): string => {
  return String(num).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
};
