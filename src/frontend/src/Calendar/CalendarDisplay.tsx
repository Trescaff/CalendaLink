import React, { useEffect, useState } from "react";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import axios from "axios";


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

  // Get today's date in the required format (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];
  
  const formatDate = (isoDate: string | Date) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // return <ScheduleXCalendar calendarApp={calendar} />;
  const [events, setEvents] = useState<Event[]>([]);
  // Initialize the events service plugin (useRef to persist instance)
  const eventsServicePlugin = React.useRef(createEventsServicePlugin()).current;
  
  useEffect(() => {
    // Fetch events from your API and add them to the events service
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user/afqhmni/events");
        console.log("Events fetched:", response.data);

        // Clear existing events to avoid duplicates
        eventsServicePlugin.getAll().forEach((event) => {
          eventsServicePlugin.remove(event.id);
        });
  
        response.data.forEach((event: any, index: number) => {
          eventsServicePlugin.add({
            id: index + 1,
            title: event.title,
            start: `${formatDate(new Date(event.date))} ${event.startTime}`,
            end: `${formatDate(new Date(event.date))} ${event.endTime}`,
            description: event.description,
          });
        });
        
        // Update state with fetched events
        //setEvents(events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    fetchEvents();
  }, []); // Empty dependency array, runs once when the component mounts
  
  // Configure the calendar app
  const calendar = useCalendarApp({
    views: [createViewWeek(), createViewMonthGrid()],
    selectedDate: today,
    plugins: [createEventModalPlugin(), createDragAndDropPlugin(), eventsServicePlugin],
  });

  return (
        <div>
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      );
}

export default CalendarDisplay;