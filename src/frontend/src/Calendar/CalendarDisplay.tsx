import React, { useEffect, useState } from "react";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { createEventsServicePlugin } from "@schedule-x/events-service";
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
    id: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    date: Date;
    location?: string;
    category?: string;
  };

  const formatDate = (isoDate: string | Date) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // return <ScheduleXCalendar calendarApp={calendar} />;
  const [events, setEvents] = useState<Event[]>([]);
  // Initialize the events service plugin
  const eventsServicePlugin = createEventsServicePlugin();

  useEffect(() => {
    // Fetch events from your API and add them to the events service
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user/afqhmni/events");
        //const data = await response.json(); 
        console.log("Events fetched:", response.data); 
        
        // Map events to the expected structure and add them to the events service
        events.map((event, index) => {
          calendar.eventsService.add({ 
            id: index + 1, // Ensure each event has a unique ID
            title: event.title,
            start: `${formatDate(new Date(event.date))} ${event.startTime}`, // Combine date and time
            end: `${formatDate(new Date(event.date))} ${event.endTime}`, // Combine date and time
            description: event.description,
      })}); 
      setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []); // Dependency to ensure the plugin instance is always available

  // Configure the calendar app
  const calendar = useCalendarApp({
    views: [createViewWeek(), createViewMonthGrid()],
    
    selectedDate: "2025-01-01",
    plugins: [createEventModalPlugin(), createDragAndDropPlugin(), createEventsServicePlugin()],
  });

  return (
        <div>
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      );
}

export default CalendarDisplay;