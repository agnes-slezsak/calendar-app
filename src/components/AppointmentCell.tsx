import type { Appointment } from "../mockApi";

interface AppointmentCellProps {
  appointment: Appointment | undefined;
  hour: number;
}

const AppointmentCell = ({ appointment, hour }: AppointmentCellProps) => {
  if (!appointment) {
    return <div className="appointment-cell" />;
  }

  const isStartRow = appointment.startHour === hour;

  return (
    <div
      className={`appointment-cell ${isStartRow ? "appointment-start" : "appointment-continuation"}`}
    >
      {isStartRow && (
        <span className="appointment-title">{appointment.title}</span>
      )}
    </div>
  );
};

export default AppointmentCell;
