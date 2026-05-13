import { useAppointments } from "./hooks/useAppointments";
import CalendarView from "./components/CalendarView";

const App = () => {
  const { appointments, loading, error, reload } = useAppointments();

  if (loading) return <p className="status-message">Loading…</p>;
  if (error)
    return (
      <div className="status-message">
        <p className="status-error">{error}</p>
        <button onClick={reload}>Retry</button>
      </div>
    );

  return (
    <main className="app">
      <button onClick={reload}>Reload</button>
      <CalendarView appointments={appointments} />
    </main>
  );
};

export default App;
