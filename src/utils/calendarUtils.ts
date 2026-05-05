import type { Appointment } from "../mockApi";

export type VisibleHourGroup = { type: "visible"; hour: number };
export type CollapsedHourGroup = {
  type: "collapsed";
  hours: number[];
  id: string;
};
export type HourGroup = VisibleHourGroup | CollapsedHourGroup;

const WEEK_START = "2025-04-07";
const HOURS_START = 8;
const HOURS_END = 20;

export const getWeekDays = (): string[] => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(WEEK_START);
    date.setDate(date.getDate() + i);
    return date.toISOString().slice(0, 10);
  });
};

export const computeHourGroups = (appointments: Appointment[]): HourGroup[] => {
  const hours = Array.from(
    { length: HOURS_END - HOURS_START },
    (_, i) => HOURS_START + i
  );

  const hourStatuses = hours.map((hour) => ({
    hour,
    isEmpty: appointments.every(
      (a) => !(a.startHour <= hour && hour < a.endHour)
    ),
  }));

  const groups: HourGroup[] = [];

  for (const { hour, isEmpty } of hourStatuses) {
    if (!isEmpty) {
      groups.push({ type: "visible", hour });
      continue;
    }

    const last = groups.at(-1);
    if (last?.type === "collapsed") {
      last.hours.push(hour);
    } else {
      groups.push({
        type: "collapsed",
        hours: [hour],
        id: `collapsed-${hour}`,
      });
    }
  }

  return groups;
};

export const getAppointmentForCell = (
  appointments: Appointment[],
  date: string,
  hour: number
): Appointment | undefined => {
  return appointments.find(
    (a) => a.date === date && a.startHour <= hour && hour < a.endHour
  );
};
