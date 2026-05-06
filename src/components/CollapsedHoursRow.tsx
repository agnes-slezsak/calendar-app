import type { CollapsedHourGroup } from "../utils/calendarUtils";

interface CollapsedHoursRowProps {
  group: CollapsedHourGroup;
  onToggle: (id: string) => void;
}

const CollapsedHoursRow = ({ group, onToggle }: CollapsedHoursRowProps) => {
  const firstHour = group.hours[0];
  const lastHour = group.hours[group.hours.length - 1];
  const label = `${String(firstHour).padStart(2, "0")}:00 – ${String(lastHour + 1).padStart(2, "0")}:00`;

  return (
    <div className="collapsed-hours-row">
      <button
        className="collapsed-hours-button"
        onClick={() => onToggle(group.id)}
      >
        {label} ▼
      </button>
    </div>
  );
};

export default CollapsedHoursRow;
