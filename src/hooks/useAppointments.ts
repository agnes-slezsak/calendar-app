import { useEffect, useState } from "react";
import { fetchAppointments, type Appointment } from "../mockApi";

interface UseAppointmentsResult {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export const useAppointments = (): UseAppointmentsResult => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments()
      .then((data) => {
        setAppointments(data);
      })
      .catch(() => {
        setError("Failed to load appointments. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refreshKey]);

  const reload = () => {
    setLoading(true);
    setError(null);
    setRefreshKey((k) => k + 1);
  };

  return { appointments, loading, error, reload };
};
