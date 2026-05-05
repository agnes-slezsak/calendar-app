import { useEffect, useState } from "react";
import { fetchAppointments, type Appointment } from "../mockApi";

interface UseAppointmentsResult {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

export const useAppointments = (): UseAppointmentsResult => {
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
  }, []);

  return { appointments, loading, error };
};
