import type { Appointment } from "../mockApi";
import { getAppointmentForCell } from "../utils/calendarUtils";
import AppointmentCell from "./AppointmentCell";

interface TimeSlotRowProps {
  hour: number;
  weekDays: string[];
  appointments: Appointment[];
}

const TimeSlotRow = ({ hour, weekDays, appointments }: TimeSlotRowProps) => {
  const label = `${String(hour).padStart(2, "0")}:00`;

  return (
    <div className="time-slot-row">
      <div className="time-label-cell">{label}</div>
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
