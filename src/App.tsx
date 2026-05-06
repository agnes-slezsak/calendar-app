import { useAppointments } from "./hooks/useAppointments";
import CalendarView from "./components/CalendarView";

const App = () => {
  const { appointments, loading, error } = useAppointments();

  if (loading) return <p className="status-message">Loading…</p>;
  if (error) return <p className="status-message status-error">{error}</p>;

  return (
    <main className="app">
      <h1 className="app-title">Week of Apr 7 – Apr 13, 2025</h1>
      <CalendarView appointments={appointments} />
    </main>
  );
};

export default App;
