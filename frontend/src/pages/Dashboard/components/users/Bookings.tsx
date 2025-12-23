import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../../Dashboard.module.scss";
import { useApiQuery } from "../../../../api/apiClient";
import { toPersianNumber } from "../../../../utils/bookingHelpers";

const Bookings: React.FC = () => {
  const { t } = useTranslation();
  const company = localStorage.getItem("company");

  const { data: bookings } = useApiQuery<any>({
    key: ["bookings"],
    url: `/bookings/${company ? JSON.parse(company).data._id : ""}`,
  });

  return (
    <div className={styles.dashboardBookings}>
      {/* Header */}
      <div className={styles.sectionHeader}>
        <h2>{t("dashboard.bookings.title")}</h2>
        <p>{t("dashboard.bookings.subtitle")}</p>
      </div>

      {/* Table */}
      <div className={styles.bookingsTable}>
        <div className={styles.tableHeader}>
          <div>{t("dashboard.bookings.customer")}</div>
          <div>{t("dashboard.bookings.service")}</div>
          <div>{t("dashboard.bookings.date")}</div>
          <div>{t("dashboard.bookings.time")}</div>
          <div>{t("dashboard.bookings.price")}</div>
          <div>{t("dashboard.bookings.status")}</div>
        </div>

        {/* Rows */}
        <div className={styles.tableBody}>
          {Array.isArray(bookings?.data) && bookings.data.length > 0 ? (
            bookings.data
              .filter((item: { status: string }) => item.status == "confirmed")
              .map((b: any) => (
                <div key={b._id} className={styles.tableRow}>
                  <div>{b.userId?.name || "-"}</div>
                  <div>{b.serviceId?.title || "-"}</div>
                  <div>{b.selectedDate}</div>
                  <div>{toPersianNumber(b.selectedTimes?.join(", "))}</div>
                  <div>{b.serviceId?.price ? `${b.serviceId.price} €` : "-"}</div>
                  <div>
                    <span
                      className={`${styles.statusBadge} ${
                        styles[`status_${b.status}`] || styles.status_pending
                      }`}
                    >
                      {b.status === "confirmed" && t("dashboard.bookings.status_confirmed")}
                      {b.status === "pending" && t("dashboard.bookings.status_pending")}
                      {b.status === "completed" && t("dashboard.bookings.status_completed")}
                      {!b.status && t("dashboard.bookings.status_pending")}
                    </span>
                  </div>
                </div>
              ))
          ) : (
            <div className={styles.noBookings}>{t("dashboard.bookings.no_data")}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
