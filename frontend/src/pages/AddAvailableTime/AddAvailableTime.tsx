import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApiMutation, useApiQuery } from "../../api/apiClient";
import { useNavigate } from "react-router-dom";
import styles from "./AddAvailableTime.module.scss";
import { showNotification } from "../../utils/showNotification";
import { getItem } from "../../utils/storage";
import { toPersianNumber } from "../../utils/bookingHelpers";

const WEEK_DAY_KEYS = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;

const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    slots.push(h.toString().padStart(2, "0") + ":00");
  }
  return slots;
};

const AvailableTimeForm: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTimes, setSelectedTimes] = useState<Record<string, string[]>>({});
  const [originalTimes, setOriginalTimes] = useState<Record<string, string[]>>({});
  const company = getItem<any>("company");
  const navigator = useNavigate();
  const companyId = company?.data?._id || "";
  const bulkUpdateMutation = useApiMutation<
    any,
    { companyId: string; timesByDay: Record<string, string[]> }
  >({
    url: `/companies/${companyId}/times/bulk`,
    method: "POST",
    options: {
      onSuccess: (data) => {
        showNotification(data.message, "success");
        navigator("/");
      },
      onError: (error) => console.error("Error:", error),
    },
  });

  const { data: listTimes, isLoading } = useApiQuery<any>({
    key: ["times-by-company", companyId],
    url: `/companies/${companyId}/times`,
  });

  const timesByDay = listTimes?.data;

  useEffect(() => {
    if (!companyId) return;

    const defaultTimes = generateTimeSlots().filter((time) => {
      const hour = parseInt(time.split(":")[0], 10);
      return hour >= 9 && hour <= 21;
    });

    const initial: Record<string, string[]> = {};
    WEEK_DAY_KEYS.forEach((d) => (initial[d] = []));

    if (timesByDay && typeof timesByDay === "object") {
      Object.keys(timesByDay).forEach((k) => {
        initial[k] =
          Array.isArray((timesByDay as any)[k]) && (timesByDay as any)[k].length > 0
            ? (timesByDay as any)[k]
            : defaultTimes;
      });
    } else {
      WEEK_DAY_KEYS.forEach((d) => (initial[d] = defaultTimes));
    }

    setSelectedTimes(initial);
    setOriginalTimes(initial);
  }, [timesByDay, companyId]);

  useEffect(() => {
    if (!companyId) return;

    const defaultTimes = generateTimeSlots().filter((time) => {
      const hour = parseInt(time.split(":")[0], 10);
      return hour >= 9 && hour <= 21;
    });

    const initial: Record<string, string[]> = {};
    WEEK_DAY_KEYS.forEach((d) => (initial[d] = []));

    if (timesByDay && typeof timesByDay === "object") {
      Object.keys(timesByDay).forEach((k) => {
        initial[k] =
          Array.isArray((timesByDay as any)[k]) && (timesByDay as any)[k].length > 0
            ? (timesByDay as any)[k]
            : defaultTimes;
      });
    } else {
      WEEK_DAY_KEYS.forEach((d) => (initial[d] = defaultTimes));
    }

    setSelectedTimes(initial);
    setOriginalTimes(initial);
  }, [timesByDay, companyId]);

  const handleSelect = (day: string, time: string) => {
    setSelectedTimes((prev) => {
      const current = prev[day] || [];
      const isSelected = current.includes(time);
      return {
        ...prev,
        [day]: isSelected ? current.filter((t) => t !== time) : [...current, time],
      };
    });
  };

  const handleSubmit = async () => {
    const changes: Record<string, string[]> = {};
    for (const day of WEEK_DAY_KEYS) {
      const newTimes = selectedTimes[day] || [];
      const oldTimes = originalTimes[day] || [];

      const hasChanged =
        newTimes.length !== oldTimes.length || newTimes.some((t) => !oldTimes.includes(t));

      if (hasChanged) changes[day] = newTimes;
    }

    await bulkUpdateMutation.mutateAsync({ companyId, timesByDay: selectedTimes });
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className={styles.addAvailablePage}>
      <div className={styles.container}>
        <div className={styles.availableCard}>
          <div className={styles.availableHeader}>
            <div className={styles.availableTitle}>
              <h2>{t("available-time.title")}</h2>
              <p>{t("available-time.subtitle")}</p>
            </div>
          </div>

          <div className={styles.timeGrid}>
            {WEEK_DAY_KEYS.map((dayKey) => (
              <div key={dayKey} className={styles.dayColumn}>
                <div className={styles.dayHeader}>{t(`available-time.weekdays.${dayKey}`)}</div>
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={`${styles.timeSlot} ${
                      selectedTimes[dayKey]?.includes(time) ? styles.selected : ""
                    }`}
                    onClick={() => handleSelect(dayKey, time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <button className={styles.saveBtn} onClick={handleSubmit} disabled={isLoading}>
              {t("available-time.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableTimeForm;
