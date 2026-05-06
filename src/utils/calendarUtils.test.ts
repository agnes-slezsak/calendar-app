import { describe, expect, it } from "vitest";
import type { Appointment } from "../mockApi";
import {
  computeHourGroups,
  getAppointmentForCell,
  getWeekDays,
} from "./calendarUtils";

// ── Helpers ──────────────────────────────────────────────────────────────────

const makeAppointment = (
  overrides: Partial<Appointment> &
    Pick<Appointment, "date" | "startHour" | "endHour">
): Appointment => ({
  id: "test-id",
  title: "Test appointment",
  ...overrides,
});

// ── getWeekDays ───────────────────────────────────────────────────────────────

describe("getWeekDays", () => {
  it("should return exactly 7 days", () => {
    expect(getWeekDays()).toHaveLength(7);
  });

  it("should start on Monday 2025-04-07", () => {
    expect(getWeekDays()[0]).toBe("2025-04-07");
  });

  it("should end on Sunday 2025-04-13", () => {
    expect(getWeekDays()[6]).toBe("2025-04-13");
  });

  it("should return all dates in YYYY-MM-DD format", () => {
    const days = getWeekDays();
    days.forEach((day) => {
      expect(day).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});

// ── computeHourGroups ─────────────────────────────────────────────────────────

describe("computeHourGroups", () => {
  it("should collapse all hours when there are no appointments", () => {
    const groups = computeHourGroups([]);
    expect(groups).toHaveLength(1);
    expect(groups[0].type).toBe("collapsed");
  });

  it("should make an hour visible when an appointment covers it", () => {
    const appointments = [
      makeAppointment({ date: "2025-04-07", startHour: 9, endHour: 10 }),
    ];
    const groups = computeHourGroups(appointments);
    const visible = groups.filter((g) => g.type === "visible");
    expect(visible).toHaveLength(1);
    expect(visible[0]).toEqual({ type: "visible", hour: 9 });
  });

  it("should merge consecutive empty hours into one collapsed group", () => {
    // only hour 10 has an appointment — 8, 9 are consecutive empty hours
    const appointments = [
      makeAppointment({ date: "2025-04-07", startHour: 10, endHour: 11 }),
    ];
    const groups = computeHourGroups(appointments);
    const collapsed = groups.filter((g) => g.type === "collapsed");

    // 8 and 9 should be in the same group, not separate
    const firstCollapsed = collapsed.find(
      (g) => g.type === "collapsed" && g.hours.includes(8)
    );
    expect(firstCollapsed?.type).toBe("collapsed");
    if (firstCollapsed?.type === "collapsed") {
      expect(firstCollapsed.hours).toContain(9);
    }
  });

  it("should create separate collapsed groups for non-consecutive empty hours", () => {
    // hour 9 and hour 11 occupied — hour 8 and hours 10 are separate empty gaps
    const appointments = [
      makeAppointment({ date: "2025-04-07", startHour: 9, endHour: 10 }),
      makeAppointment({ date: "2025-04-07", startHour: 11, endHour: 12 }),
    ];
    const groups = computeHourGroups(appointments);
    const collapsed = groups.filter((g) => g.type === "collapsed");
    expect(collapsed.length).toBeGreaterThanOrEqual(2);
  });

  it("should use the first hour of the group as the collapsed group id", () => {
    const appointments = [
      makeAppointment({ date: "2025-04-07", startHour: 10, endHour: 11 }),
    ];
    const groups = computeHourGroups(appointments);
    const firstCollapsed = groups.find((g) => g.type === "collapsed");
    expect(firstCollapsed?.type).toBe("collapsed");
    if (firstCollapsed?.type === "collapsed") {
      expect(firstCollapsed.id).toBe(`collapsed-${firstCollapsed.hours[0]}`);
    }
  });

  it("should treat a multi-hour appointment as occupying all covered hours", () => {
    const appointments = [
      makeAppointment({ date: "2025-04-07", startHour: 9, endHour: 11 }),
    ];
    const groups = computeHourGroups(appointments);
    const visibleHours = groups
      .filter((g) => g.type === "visible")
      .map((g) => (g.type === "visible" ? g.hour : null));
    expect(visibleHours).toContain(9);
    expect(visibleHours).toContain(10);
  });
});

// ── getAppointmentForCell ─────────────────────────────────────────────────────

describe("getAppointmentForCell", () => {
  const appointment = makeAppointment({
    date: "2025-04-07",
    startHour: 9,
    endHour: 11,
  });

  it("should return the appointment for its start hour", () => {
    expect(getAppointmentForCell([appointment], "2025-04-07", 9)).toBe(
      appointment
    );
  });

  it("should return the appointment for a continuation hour", () => {
    expect(getAppointmentForCell([appointment], "2025-04-07", 10)).toBe(
      appointment
    );
  });

  it("should return undefined for the hour at endHour (exclusive end)", () => {
    expect(
      getAppointmentForCell([appointment], "2025-04-07", 11)
    ).toBeUndefined();
  });

  it("should return undefined for a different date", () => {
    expect(
      getAppointmentForCell([appointment], "2025-04-08", 9)
    ).toBeUndefined();
  });

  it("should return undefined when no appointments exist", () => {
    expect(getAppointmentForCell([], "2025-04-07", 9)).toBeUndefined();
  });

  it("should return the correct appointment when multiple exist on the same day", () => {
    const morning = makeAppointment({
      id: "morning",
      date: "2025-04-07",
      startHour: 9,
      endHour: 10,
    });
    const afternoon = makeAppointment({
      id: "afternoon",
      date: "2025-04-07",
      startHour: 14,
      endHour: 15,
    });
    expect(getAppointmentForCell([morning, afternoon], "2025-04-07", 14)).toBe(
      afternoon
    );
  });
});
