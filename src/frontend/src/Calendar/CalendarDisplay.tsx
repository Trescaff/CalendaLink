import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";

function CalendarDisplay() {
  const calendar = useCalendarApp({
    views: [createViewWeek(), createViewMonthGrid()],
    events: [
      {
        id: 1,
        title: "Final Presentation",
        start: "2024-12-09 13:30",
        end: "2024-12-09 14:45",
        description: "Bonjour, Je Mapeile...",
      },
    ],
    selectedDate: "2025-01-01",
    plugins: [createEventModalPlugin(), createDragAndDropPlugin()],
  });

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}

export default CalendarDisplay;
