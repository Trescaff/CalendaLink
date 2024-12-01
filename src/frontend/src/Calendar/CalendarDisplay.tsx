import React, { useEffect, useState } from "react";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import axios from "axios";

// function CalendarDisplay() {

//   const calendar = useCalendarApp({
//     views: [createViewWeek(), createViewMonthGrid()],
//     events: [
//       {
//         id: 1,
//         title: "Final Presentation",
//         start: "2024-12-09 13:30",
//         end: "2024-12-09 14:45",
//         description: "Bonjour, Je Mapeile...",
//       },
//     ],
//     selectedDate: "2025-01-01",
//     plugins: [createEventModalPlugin(), createDragAndDropPlugin()],
//   });

//   return (
//     <div>
//       <ScheduleXCalendar calendarApp={calendar} />
//     </div>
//   );
// }

function CalendarDisplay() {

  type Event = {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    date: string; // Add this line
    description: string;
    location?: string; // Optional
    category?: string; // Optional
    notifications?: {
    repeat: string;
    methods: string[];
  }; // Optional
  };

  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user/afqhmni/events");
        setEvents(response.data);
        console.log("Events fetched successfully:", events[0].date);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const calendar = useCalendarApp({
    views: [createViewWeek(), createViewMonthGrid()],
    events: events.map((event, index) => ({
      id: index.toString(),
      title: event.title,
      start: `${event.date}T${event.startTime}`,
      end: `${event.date}T${event.endTime}`,
      description: event.description,
    })),
    selectedDate: "2025-01-01",
  });

  return <ScheduleXCalendar calendarApp={calendar} />;
}

export default CalendarDisplay;