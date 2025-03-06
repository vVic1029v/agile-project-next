import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getWeekAndDay, getWeekStartDateFromYearWeek } from "@/lib/calendarUtils";

export type SelectedDate = {
  day: number;
  month: number;
  year: number;
  week: number;
  dayWeek: number;
  period?: number;
}

export const getToday = (): SelectedDate => {
  const now = new Date();
  const { week, dayWeek } = getWeekAndDay(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return {
    day: now.getDate(),
    month: now.getMonth(),
    year: now.getFullYear(),
    week: week,
    dayWeek,
  };
};

const initializeState = (yearParam: string | null, weekParam: string | null, dateParam: string | null) => {
  const today = new Date();
  let initialYear = yearParam ? Number(yearParam) : today.getFullYear();
  let initialWeek = weekParam ? Number(weekParam.split("W")[1]) - 1 : getWeekAndDay(initialYear, today.getMonth() + 1, today.getDate()).week;
  let initialSelectedDate = getToday();

  if (dateParam) {
    const [year, month, day] = dateParam.split("-").map(Number);
    const { week, dayWeek } = getWeekAndDay(year, month, day);
    initialYear = year;
    initialWeek = week;

    initialSelectedDate = {
      ...initialSelectedDate,
      day: day,
      month: month-1,
      year: initialYear ,
      week: initialWeek,
      dayWeek: dayWeek,
    };
  } else {
    initialSelectedDate = {
      ...initialSelectedDate,
      year: initialYear,
      week: initialWeek,
    }
  }

  return { initialSelectedDate };
};


export const useCalendarState = (isWeekView: boolean) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { initialSelectedDate } = initializeState(
    searchParams.get("year"),
    searchParams.get("week"),
    searchParams.get("date")
  );

  const [selectedDate, setSelectedDate] = useState<SelectedDate>(initialSelectedDate);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(!!searchParams.get("date"));

  useEffect(() => {
    if (searchParams.get("year")) {
      const year = Number(searchParams.get("year"));
      setSelectedDate((prev) => ({ ...prev, year }));
    }
  }, [searchParams]);

  const updateUrl = useCallback(
    (year: number, week?: number, extraParams: Record<string, string> = {}) => {
      const search = new URLSearchParams(searchParams.toString());
      search.set("year", String(year));
      if (isWeekView && week !== undefined) {
        search.set("week", `W${String(week + 1).padStart(2, "0")}`); // Convert to 1-indexed
      }
      if (!("date" in extraParams)) {
        search.delete("date");
      }
      for (const key in extraParams) {
        search.set(key, extraParams[key]);
      }
      router.replace(`${pathname}?${search.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname, isWeekView]
  );

  return {
    selectedDate,
    setSelectedDate,
    updateUrl,
    isModalOpen,
    setIsModalOpen,
  };
};