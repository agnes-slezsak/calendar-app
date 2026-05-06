import { useMemo, useState } from "react";
import type { Appointment } from "../mockApi";
import { computeHourGroups, getWeekDays } from "../utils/calendarUtils";
import CalendarHeader from "./CalendarHeader";
import CollapsedHoursRow from "./CollapsedHoursRow";
import TimeSlotRow from "./TimeSlotRow";

interface CalendarViewProps {
  appointments: Appointment[];
}

const CalendarView = ({ appointments }: CalendarViewProps) => {
  const weekDays = getWeekDays();
  const hourGroups = useMemo(
    () => computeHourGroups(appointments),
    [appointments]
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="calendar-view">
      <CalendarHeader weekDays={weekDays} />
      {hourGroups.map((group) => {
        if (group.type === "collapsed") {
          if (expandedGroups.has(group.id)) {
            return group.hours.map((hour, i) => (
              <TimeSlotRow
                key={hour}
                hour={hour}
                weekDays={weekDays}
                appointments={appointments}
                isCollapsible={true}
                onCollapse={i === 0 ? () => handleToggle(group.id) : undefined}
              />
            ));
          }
          return (
            <CollapsedHoursRow
              key={group.id}
              group={group}
              onToggle={handleToggle}
            />
          );
        }
        return (
          <TimeSlotRow
            key={group.hour}
            hour={group.hour}
            weekDays={weekDays}
            appointments={appointments}
          />
        );
      })}
    </div>
  );
};

export default CalendarView;
