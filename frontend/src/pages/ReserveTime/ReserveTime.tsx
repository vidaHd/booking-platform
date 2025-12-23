import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker, { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import { useTranslation } from "react-i18next";

import { ButtonUI } from "../../ui-kit";
import { VariantType } from "../../ui-kit/button/button.type";
import { showNotification } from "../../utils/showNotification";
import { useApiMutation } from "../../api/apiClient";
import { useServices } from "../../hooks/useServices";
import { useCompanyData } from "../../hooks/useCompanyData";
import { useBookings } from "../../hooks/useBookings";

import styles from "./reserveTime.module.scss";
import {
  getFormattedDate,
  getTimeStatus,
  mapUserBookings,
  toPersianNumber,
} from "../../utils/bookingHelpers";
import { WEEK_DAY_KEYS } from "../../constant/variable";
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { getItem, setItem } from "../../utils/storage";
import { FiXCircle } from "react-icons/fi";

const ALL_TIMES = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

const ReserveTime = () => {
  const { url } = useParams();
  const { t, i18n } = useTranslation();
  const isPersian = i18n.language.startsWith("fa");
  const navigate = useNavigate();

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<DateObject>(
    new DateObject({ calendar: isPersian ? persian : gregorian })
  );
  const [selectedTimes, setSelectedTimes] = useState<
    Record<string, { date: string; time: string; userId?: string }>
  >({});

  const userId = (getItem<{ id: string }>("user") as any)?.id;
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showReservationOpen, setShowReservationOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<{
    id?: string;
    status: boolean;
  }>({
    status: false,
  });

  const { companyData, companyTimes } = useCompanyData(url);
  const {
    companyBookings,
    userBookings,

    refetchCompanyBookings,
    refreshAllBooking,
    refreshUserBookings,
  } = useBookings(companyData?.data?._id, userId, getFormattedDate(selectedDate));

  const { servicesByCompany } = useServices(companyData?.data?._id);

  // ---------- EFFECTS ----------
  useEffect(() => {
    const userData = userBookings?.data?.bookings || [];
    if (userData.length > 0) {
      const mapped = mapUserBookings(userData, userId);
      setSelectedTimes(mapped);
      if (!selectedService && Object.keys(mapped).length > 0) {
        setSelectedService(Object.keys(mapped)[0]);
      }
    }
  }, [userBookings?.data, userId]);

  useEffect(() => {
    if (authPromptOpen) {
      setItem("redirectAfterLogin", window.location.pathname);
    }
  }, [authPromptOpen]);

  useEffect(() => {
    if (selectedService) refetchCompanyBookings();
  }, [selectedService]);

  // ---------- MEMOS ----------
  const selectedDayKey = useMemo(() => WEEK_DAY_KEYS[selectedDate.weekDay.index], [selectedDate]);

  const availableTimes = useMemo(
    () => companyTimes?.data?.[selectedDayKey] || [],
    [companyTimes?.data, selectedDayKey]
  );

  const bookedTimes = useMemo(() => {
    if (!companyBookings?.data) return [];
    const formattedDate = getFormattedDate(selectedDate);
    return companyBookings.data
      .filter((b: any) => b.selectedDate === formattedDate && b.userId !== userId)
      .flatMap((b: any) => b.selectedTimes);
  }, [companyBookings?.data, selectedDate, userId]);

  // ---------- HANDLERS ----------
  const handleSelectService = (service: any) => {
    if (!userId) {
      setAuthPromptOpen(true);
      return;
    }
    setSelectedService(service.serviceId);
  };

  const handleTimeSelect = (time: string) => {
    if (!selectedService) return showNotification(t("reservTime.please_select_service"), "error");

    const formattedDate = getFormattedDate(selectedDate);
    setSelectedTimes((prev) => ({
      ...prev,
      [selectedService]: { date: formattedDate, time, userId },
    }));
  };

  const createBookingMutation = useApiMutation<
    any,
    { serviceId: string; selectedDate?: string; selectedTimes?: string }
  >({
    url: companyData ? `/bookings/${companyData?.data?._id}/${userId}` : "",
    method: "POST",
    options: {
      onSuccess: () => {
        refetchCompanyBookings();
        refreshAllBooking();
        refreshUserBookings();
        showNotification(t("reservTime.booking_saved"), "success");
        setShowReservationOpen(true);
      },
    },
  });

  // format date for display
  const formatDisplayDate = (dateString: string, isPersian: boolean) => {
    const dateObj = new DateObject({ date: dateString, calendar: gregorian });

    return isPersian ? dateObj.convert(persian).format("YYYY/MM/DD") : dateObj.format("YYYY-MM-DD");
  };

  const handleSave = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedService) return showNotification(t("reservTime.please_select_service"), "warning");

    const info = selectedTimes[selectedService];
    if (!info) return showNotification(t("reservTime.no_booking_selected"), "warning");
    setConfirmOpen(false);

    try {
      await createBookingMutation.mutateAsync({
        serviceId: selectedService,
        selectedDate: info.date,
        selectedTimes: info.time,
      });
    } catch {
      showNotification(t("reservTime.booking_save_failed"), "error");
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  const handleConfirmDelete = (id: string) => {
    setDeleteConfirmOpen({ id: id, status: true });
  };
  const handleCancelDelete = () => {
    setDeleteConfirmOpen({ status: false });
  };

  const handleDeleteReservTime = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/bookings/${deleteConfirmOpen.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error();
      refetchCompanyBookings();
      refreshAllBooking();
      refreshUserBookings();
      handleCancelDelete();
      showNotification(t("reservTime.deleted_successfully"), "success");
    } catch {
      showNotification(t("reservTime.delete_failed"), "error");
    }
  };

  const handleNextWeek = () => setSelectedDate((prev) => new DateObject(prev).add(7, "days"));
  const handlePrevWeek = () => setSelectedDate((prev) => new DateObject(prev).subtract(7, "days"));
  const handleNextDay = () => setSelectedDate((prev) => new DateObject(prev).add(1, "day"));
  const handlePrevDay = () => setSelectedDate((prev) => new DateObject(prev).subtract(1, "day"));

  // ---------- EARLY RETURNS ----------
  if (!companyData)
    return (
      <div className={styles.center}>
        <p>{t("reservTime.no_company_found")}</p>
      </div>
    );

  // ---------- RENDER ----------
  return (
    <div className={`${styles.reserveTimePage} ${isPersian ? styles.rtl : styles.ltr}`}>
      <div className={styles.container}>
        {/* Left Panel */}
        <motion.div
          className={styles.leftPanel}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className={styles.contentDate}>
            <span>{t("reservTime.select_date")} </span>
            <img src="/images/date-23919_256.gif" alt="Reserve Icon" />
          </div>

          <div className={`${styles.dateNavBar} ${isPersian ? styles.rtl : ""}`}>
            <button
              className={styles.navBtn}
              onClick={handlePrevWeek}
              title={t("reservTime.prev_week")}
            >
              {isPersian ? <FiChevronsRight size={20} /> : <FiChevronsLeft size={20} />}
            </button>

            <button
              className={styles.navBtn}
              onClick={handlePrevDay}
              title={t("reservTime.prev_day")}
            >
              {isPersian ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
            </button>

            <div className={styles.currentDate}>
              {isPersian
                ? toPersianNumber(selectedDate.format("YYYY/MM/DD"))
                : selectedDate.format("YYYY-MM-DD")}{" "}
            </div>

            <button
              className={styles.navBtn}
              onClick={handleNextDay}
              title={t("reservTime.next_day")}
            >
              {isPersian ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
            </button>

            <button
              className={styles.navBtn}
              onClick={handleNextWeek}
              title={t("reservTime.next_week")}
            >
              {isPersian ? <FiChevronsLeft size={20} /> : <FiChevronsRight size={20} />}
            </button>
          </div>
          <DatePicker
            value={selectedDate}
            onChange={(date) => setSelectedDate(date as DateObject)}
            calendar={isPersian ? persian : gregorian}
            locale={isPersian ? persian_fa : gregorian_en}
            calendarPosition="bottom-center"
            style={{
              width: "100%",
              textAlign: "center",
              padding: "18px 0",
              borderRadius: "8px",
              fontSize: "1rem",
              border: "1px solid #bbb",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              background: "#fff",
            }}
          />

          <h3>{t("reservTime.select_time")}</h3>
          <div className={styles.timeGrid}>
            {ALL_TIMES.filter((time) => {
              const { isAvailable, isBookedByOthers, userBooking } = getTimeStatus(
                time,
                selectedDate,
                {
                  availableTimes,
                  bookedTimes,
                  userBookings: userBookings?.data || [],
                  selectedService,
                  selectedTimes,
                }
              );

              return (isAvailable && !isBookedByOthers) || userBooking;
            }).map((time) => {
              const { isAvailable, userBooking, isActive } = getTimeStatus(time, selectedDate, {
                availableTimes,
                bookedTimes,
                userBookings: userBookings?.data || [],
                selectedService,
                selectedTimes,
              });

              return (
                <motion.div
                  key={time}
                  whileHover={isAvailable ? { scale: 1.05 } : {}}
                  whileTap={isAvailable ? { scale: 0.95 } : {}}
                  className={`${styles.timeBox} 
            ${isAvailable ? styles.enabled : styles.disabled}
            ${isActive ? styles.active : ""}
            ${userBooking ? styles.booked : ""}`}
                  onClick={() => isAvailable && !userBooking && handleTimeSelect(time)}
                >
                  {isPersian ? toPersianNumber(time) : time}
                </motion.div>
              );
            })}
          </div>
          {/* ss */}
          <hr />
          {userBookings?.data.length >= 1 && <p>{t("reservTime.services_for_selected_date")}</p>}

          <div className={styles.selectServicesList}>
            <div className={styles.servicesContainer}>
              {userBookings?.data?.map((booking: any) => {
                const service = servicesByCompany?.data?.find(
                  (s: any) => s.serviceId === booking.serviceId._id
                );

                if (!service) return null;

                return (
                  <motion.div key={booking._id} className={styles.serviceCardSelcted}>
                    <div className={styles.serviceHeader}>
                      <h4>{service.title}</h4>

                      <div>
                        <div>
                          <span>
                            {isPersian
                              ? `${toPersianNumber(booking.selectedTimes[0])} -- ${toPersianNumber(booking.selectedDate)}`
                              : `${formatDisplayDate(booking.selectedDate, false)}: ${booking.selectedTimes[0]}`}
                          </span>
                        </div>
                        <span className={styles.statusBadge}>
                          {booking.status === "confirmed" && (
                            <span className={styles.statusContent}>
                              {t("dashboard.bookings.status_confirmed")}
                              <img
                                src="/images/tick-13644_256.gif"
                                alt="Confirmed"
                                className={styles.statusIcon}
                              />
                            </span>
                          )}

                          {booking.status === "pending" && (
                            <span className={styles.statusContent}>
                              {t("dashboard.bookings.status_pending")}
                              <img
                                src="/images/load-24098_256.gif"
                                alt="Pending"
                                className={styles.statusIcon}
                              />
                            </span>
                          )}

                          {booking.status === "completed" && (
                            <span className={styles.statusContent}>
                              {t("dashboard.bookings.status_completed")}
                              <img
                                src="/images/completed.gif"
                                alt="Completed"
                                className={styles.statusIcon}
                              />
                            </span>
                          )}

                          {!booking.status && (
                            <span className={styles.statusContent}>
                              {t("dashboard.bookings.status_pending")}
                              <img
                                src="/images/pending.gif"
                                alt="Pending"
                                className={styles.statusIcon}
                              />
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    <span
                      className={styles.deleteIcon}
                      onClick={() => handleConfirmDelete(booking._id)}
                    >
                      <FiXCircle />
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
          {/*  */}
        </motion.div>

        {/* Right Panel */}
        <motion.div
          className={styles.rightPanel}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className={styles.servicesList}>
            <p>{t("reservTime.all_services")}</p>
            <div className={styles.servicesContainer}>
              {servicesByCompany?.data?.map((service: any) => (
                <motion.div
                  key={service.serviceId}
                  className={`${styles.serviceCard} ${
                    selectedService === service.serviceId ? styles.activeService : ""
                  }`}
                  onClick={() => handleSelectService(service)}
                >
                  <h4>{service.title}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className={styles.footer}>
        {selectedService && (
          <ButtonUI
            variant={createBookingMutation.isPending ? VariantType.SECONDARY : VariantType.PRIMARY}
            onClick={handleSave}
            disabled={createBookingMutation.isPending || !selectedTimes?.[selectedService]?.time}
          >
            {createBookingMutation.isPending
              ? t("reservTime.pending")
              : !selectedTimes?.[selectedService]?.time
                ? t("reservTime.select_time")
                : t("reservTime.save_booking")}
          </ButtonUI>
        )}
      </div>

      <ConfirmModal
        isOpen={authPromptOpen}
        title={t("auth.required")}
        message={t("auth.login_or_register_to_continue")}
        confirmText={t("auth.login")}
        cancelText={t("auth.register")}
        onConfirm={() => {
          setAuthPromptOpen(false);
          navigate("/login");
        }}
        onCancel={() => {
          setAuthPromptOpen(false);
          navigate("/register");
        }}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        title={t("reservTime.confirm_title") || "تأیید رزرو"}
        message={
          selectedService && isPersian
            ? `آیا از رزرو ساعت ${selectedTimes?.[selectedService]?.time} در تاریخ ${toPersianNumber(selectedDate.format("YYYY/MM/DD"))} اطمینان دارید؟`
            : `Are you sure you want to book ${selectedTimes[0]?.date} on ${selectedDate.format("YYYY-MM-DD")}?`
        }
        confirmText={t("reservTime.confirm")}
        cancelText={t("reservTime.cancel")}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <ConfirmModal
        isOpen={showReservationOpen}
        title={t("reservTime.confirm_title") || "تأیید رزرو"}
        message={t("reservTime.isWaiting")}
        confirmText={t("reservTime.confirm")}
        cancelText={t("reservTime.cloese")}
        onCancel={() => setShowReservationOpen(false)}
      />

      <ConfirmModal
        isOpen={deleteConfirmOpen.status}
        title={t("reservTime.delete_title") || "حذف رزرو"}
        message={
          isPersian
            ? "آیا مطمئن هستید که می‌خواهید این رزرو را حذف کنید؟"
            : "Are you sure you want to delete this reservation?"
        }
        confirmText={t("reservTime.confirm")}
        cancelText={t("reservTime.cancel")}
        onConfirm={handleDeleteReservTime}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default ReserveTime;
