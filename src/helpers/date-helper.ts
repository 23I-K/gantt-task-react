import addYears from "date-fns/addYears";
import addMonths from "date-fns/addMonths";
import addDays from "date-fns/addDays";
import addHours from "date-fns/addHours";
import subYears from "date-fns/subYears";
import subMonths from "date-fns/subMonths";
import subDays from "date-fns/subDays";
import subHours from "date-fns/subHours";
import subWeeks from "date-fns/subWeeks";
import startOfYear from "date-fns/startOfYear";
import startOfMonth from "date-fns/startOfMonth";
import startOfDay from "date-fns/startOfDay";
import startOfHour from "date-fns/startOfHour";
import startOfWeek from "date-fns/startOfWeek";
import startOfQuarter from "date-fns/startOfQuarter";

import { TaskOrEmpty, ViewMode } from "../types/public-types";
import { getDatesDiff } from "./get-dates-diff";

export const ganttDateRange = (
  tasks: readonly TaskOrEmpty[],
  viewMode: ViewMode,
  preStepsCount: number
): [Date, Date, Date, Date, number, number] => {
  let minTaskDate: Date | null = null;
  let minTask2Date: Date | null = null;
  let maxTaskDate: Date | null = null;
  let maxTask2Date: Date | null = null;
  for (const task of tasks) {
    if (task.type !== "empty") {
      if (!minTaskDate || task.start < minTaskDate) {
        minTaskDate = task.start;
      }

      if (!minTask2Date || task.start2 < minTask2Date) {
        minTask2Date = task.start2;
      }

      if (!maxTaskDate || task.end > maxTaskDate) {
        maxTaskDate = task.end;
      }

      if (!maxTask2Date || task.end2 > maxTask2Date) {
        maxTask2Date = task.end2;
      }
    }
  }

  if (!minTaskDate || !maxTaskDate || !minTask2Date || !maxTask2Date) {
    return [new Date(), new Date(), new Date(), new Date(), 2, 2];
  }

  let newStartDate: Date | null = null;
  let newStart2Date: Date | null = null;
  let newEndDate: Date | null = null;
  let newEnd2Date: Date | null = null;

  switch (viewMode) {
    case ViewMode.Year:
      newStartDate = subYears(minTaskDate, preStepsCount);
      newStartDate = startOfYear(newStartDate);
      newStart2Date = subYears(minTask2Date, preStepsCount);
      newStart2Date = startOfYear(newStart2Date);
      newEndDate = addYears(maxTaskDate, 1);
      newEndDate = startOfYear(newEndDate);
      newEnd2Date = addYears(maxTask2Date, 1);
      newEnd2Date = startOfYear(newEnd2Date);
      break;
    case ViewMode.QuarterYear:
      newStartDate = subMonths(minTaskDate, preStepsCount * 3);
      newStartDate = startOfQuarter(newStartDate);
      newStart2Date = subMonths(minTask2Date, preStepsCount * 3);
      newStart2Date = startOfQuarter(newStart2Date);
      newEndDate = addMonths(maxTaskDate, 3);
      newEndDate = startOfQuarter(addMonths(newEndDate, 3));
      newEnd2Date = addMonths(maxTask2Date, 3);
      newEnd2Date = startOfQuarter(addMonths(newEnd2Date, 3));
      break;
    case ViewMode.Month:
      newStartDate = subMonths(minTaskDate, preStepsCount);
      newStartDate = startOfMonth(newStartDate);
      newStart2Date = subMonths(minTask2Date, preStepsCount);
      newStart2Date = startOfMonth(newStart2Date);
      newEndDate = addYears(maxTaskDate, 1);
      newEndDate = startOfYear(newEndDate);
      newEnd2Date = addYears(maxTask2Date, 1);
      newEnd2Date = startOfYear(newEnd2Date);
      break;
    case ViewMode.Week:
      newStartDate = startOfWeek(minTaskDate);
      newStartDate = subWeeks(newStartDate, preStepsCount);
      newStart2Date = startOfWeek(minTask2Date);
      newStart2Date = subWeeks(newStart2Date, preStepsCount);
      newEndDate = startOfDay(maxTaskDate);
      newEndDate = addMonths(newEndDate, 1.5);
      newEnd2Date = startOfDay(maxTask2Date);
      newEnd2Date = addMonths(newEnd2Date, 1.5);
      break;
    case ViewMode.TwoDays:
      newStartDate = startOfDay(minTaskDate);
      newStartDate = subDays(newStartDate, preStepsCount);
      newStart2Date = startOfDay(minTask2Date);
      newStart2Date = subDays(newStart2Date, preStepsCount);
      newEndDate = startOfDay(maxTaskDate);
      newEndDate = addDays(newEndDate, 19);
      newEnd2Date = startOfDay(maxTask2Date);
      newEnd2Date = addDays(newEnd2Date, 19);
      break;
    case ViewMode.Day:
      newStartDate = startOfDay(minTaskDate);
      newStartDate = subDays(newStartDate, preStepsCount);
      newStart2Date = startOfDay(minTask2Date);
      newStart2Date = subDays(newStart2Date, preStepsCount);
      newEndDate = startOfDay(maxTaskDate);
      newEndDate = addDays(newEndDate, 30);
      newEnd2Date = startOfDay(maxTask2Date);
      newEnd2Date = addDays(newEnd2Date, 30);
      break;
    case ViewMode.QuarterDay:
      newStartDate = startOfDay(minTaskDate);
      newStartDate = subHours(newStartDate, preStepsCount * 6);
      newStart2Date = startOfDay(minTask2Date);
      newStart2Date = subHours(newStart2Date, preStepsCount * 6);
      newEndDate = startOfDay(maxTaskDate);
      newEndDate = addHours(newEndDate, 66);
      newEnd2Date = startOfDay(maxTask2Date);
      newEnd2Date = addHours(newEnd2Date, 66); // 24(1 day)*3 - 6
      break;
    case ViewMode.HalfDay:
      newStartDate = startOfDay(minTaskDate);
      newStartDate = subHours(newStartDate, preStepsCount * 12);
      newStart2Date = startOfDay(minTask2Date);
      newStart2Date = subHours(newStart2Date, preStepsCount * 12);
      newEndDate = startOfDay(maxTaskDate);
      newEndDate = addHours(newEndDate, 108); // 24(1 day)*5 - 12
      newEnd2Date = startOfDay(maxTask2Date);
      newEnd2Date = addHours(newEnd2Date, 108); // 24(1 day)*5 - 12
      break;
    case ViewMode.Hour:
      newStartDate = startOfHour(minTaskDate);
      newStartDate = subHours(newStartDate, preStepsCount);
      newStart2Date = startOfHour(minTask2Date);
      newStart2Date = subHours(newStart2Date, preStepsCount);
      newEndDate = startOfDay(maxTaskDate);
      newEndDate = addDays(newEndDate, 1);
      newEnd2Date = startOfDay(maxTask2Date);
      newEnd2Date = addDays(newEnd2Date, 1);
      break;
  }

  return [
    newStartDate,
    newStart2Date,
    minTaskDate,
    minTask2Date,
    getDatesDiff(newEndDate, newStartDate, viewMode),
    getDatesDiff(newEnd2Date, newStart2Date, viewMode),
  ];
};

export const getWeekNumberISO8601 = (date: Date) => {
  const tmpDate = new Date(date.valueOf());
  const dayNumber = (tmpDate.getDay() + 6) % 7;
  tmpDate.setDate(tmpDate.getDate() - dayNumber + 3);
  const firstThursday = tmpDate.valueOf();
  tmpDate.setMonth(0, 1);
  if (tmpDate.getDay() !== 4) {
    tmpDate.setMonth(0, 1 + ((4 - tmpDate.getDay() + 7) % 7));
  }
  const weekNumber = (
    1 + Math.ceil((firstThursday - tmpDate.valueOf()) / 604800000)
  ).toString();

  if (weekNumber.length === 1) {
    return `0${weekNumber}`;
  } else {
    return weekNumber;
  }
};

export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};
