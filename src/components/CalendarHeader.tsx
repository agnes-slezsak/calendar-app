interface CalendarHeaderProps {
  weekDays: string[];
}

const CalendarHeader = ({ weekDays }: CalendarHeaderProps) => {
  const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="calendar-header">
      <div className="time-label-cell" />
      {weekDays.map((date, i) => {
        const [, month, day] = date.split("-");
        return (
          <div key={date} className="day-header">
            {DAY_LABELS[i]} {day}/{month}
          </div>
        );
      })}
    </div>
  );
};

export default CalendarHeader;
