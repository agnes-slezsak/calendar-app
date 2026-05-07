import type { Appointment } from "../mockApi";
import { getAppointmentForCell } from "../utils/calendarUtils";
import AppointmentCell from "./AppointmentCell";

interface TimeSlotRowProps {
  hour: number;
  weekDays: string[];
  appointments: Appointment[];
  isGrouped?: boolean;
  onCollapse?: () => void;
}

const TimeSlotRow = ({
  hour,
  weekDays,
  appointments,
  onCollapse,
  isGrouped = false,
}: TimeSlotRowProps) => {
  const label = `${String(hour).padStart(2, "0")}:00`;

  return (
    <div
      className={`time-slot-row${isGrouped ? " time-slot-row--grouped" : ""}`}
    >
      <div className="time-label-cell">
        {onCollapse ? (
          <button className="time-label-collapse" onClick={onCollapse}>
            {label} ▲
          </button>
        ) : (
          label
        )}
      </div>
      {weekDays.map((date) => (
        <AppointmentCell
          key={date}
          appointment={getAppointmentForCell(appointments, date, hour)}
          hour={hour}
        />
      ))}
    </div>
  );
};

export default TimeSlotRow;
