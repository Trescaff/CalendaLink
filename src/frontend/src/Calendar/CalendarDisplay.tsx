import React, { useEffect, useState } from "react";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import axios from "axios";
import { useUser } from "../components/UserContext";



type Event = {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: string;
  location?: string;
  category?: string;
};

const formatDateTime = (date: string, time: string) => {
  const datePart = date.split("T")[0];
  return `${datePart} ${time}`;
};

const CalendarDisplay = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user/afqhmni/events");
        console.log("Events fetched:", response.data);

        const mappedEvents = response.data.map((event: any) => ({
          id: event._id,
          title: event.title,
          description: event.description,
          startTime: event.startTime,
          endTime: event.endTime,
          date: event.date,
          location: event.location,
          category: event.category,
        }));
        setEvents(mappedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await axios.get(`http://localhost:5000/calendar/remove/afqhmni/${eventId}`);
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
      setSelectedEvent(null);
      console.log("Event deleted:", eventId);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const calendar = useCalendarApp({
    views: [createViewWeek(), createViewMonthGrid()],
    events: events.map((event) => ({
      id: event.id,
      title: event.title,
      start: formatDateTime(event.date, event.startTime),
      end: formatDateTime(event.date, event.endTime),
      description: event.description,
    })),
    selectedDate: "2025-01-01",
    onEventClick: (event) => {
      const clickedEvent = events.find(e => e.id === event.id);
      setSelectedEvent(clickedEvent || null);
      console.log("Selected event:", clickedEvent); // Add logging
    }
  });

  const modalStyle: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white", // Ensure the background color is set correctly
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
  };

  const buttonStyle: React.CSSProperties = {
    margin: "10px",
  };

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
      {selectedEvent && (
        <div style={modalStyle}>
          <h3>Edit Event</h3>
          <p>Are you sure you want to delete this event?</p>
          <p>Title: {selectedEvent.title}</p>
          <p>Description: {selectedEvent.description}</p>
          <p>Start Time: {selectedEvent.startTime}</p>
          <p>End Time: {selectedEvent.endTime}</p>
          <button
            type="button"
            style={buttonStyle}
            onClick={() => handleDeleteEvent(selectedEvent.id)}
          >
            Delete
          </button>
          <button type="button" onClick={() => setSelectedEvent(null)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarDisplay;
// import React, { useEffect, useState } from "react";
// import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
// import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
// import "@schedule-x/theme-default/dist/index.css";
// import { createEventModalPlugin } from "@schedule-x/event-modal";
// import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
// import { createEventsServicePlugin } from "@schedule-x/events-service";
// import axios from "axios";

// function CalendarDisplay() {
//   type Event = {
//     id: number;
//     title: string;
//     description: string;
//     startTime: string;
//     endTime: string;
//     date: Date;
//     location?: string;
//     category?: string;
//   };

//   // Get today's date in the required format (YYYY-MM-DD)
//   const today = new Date().toISOString().split("T")[0];

//   const formatDate = (isoDate: string | Date) => {
//     const date = new Date(isoDate);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const [events, setEvents] = useState<Event[]>([]);
//   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

//   // Initialize the events service plugin
//   const eventsServicePlugin = React.useRef(createEventsServicePlugin()).current;

//   useEffect(() => {
//     // Fetch events from your API and add them to the events service
//     const fetchEvents = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/user/${username}/events`);
//         console.log("Events fetched:", response.data);

//         // Clear existing events to avoid duplicates
//         eventsServicePlugin.getAll().forEach((event) => {
//           eventsServicePlugin.remove(event.id);
//         });

//         response.data.forEach((event: any) => {
//           eventsServicePlugin.add({
//             id: event.id,
//             title: event.title,
//             start: `${formatDate(new Date(event.date))} ${event.startTime}`,
//             end: `${formatDate(new Date(event.date))} ${event.endTime}`,
//             description: event.description,
//           });
//         });

//         // Update state with fetched events
//         setEvents(response.data);
//       } catch (error) {
//         console.error("Error fetching events:", error);
//       }
//     };

//     fetchEvents();
//   }, [eventsServicePlugin]);

//   // Handle event click
//   useEffect(() => {
//     const handleEventClick = (event: any) => {
//       setSelectedEvent({
//         id: event.id,
//         title: event.title,
//         description: event.description,
//         startTime: event.start,
//         endTime: event.end,
//         date: new Date(event.start),
//       });
//     };

//     eventsServicePlugin.on("eventClick", handleEventClick);

//     return () => {
//       // Cleanup the listener
//       eventsServicePlugin.off("eventClick", handleEventClick);
//     };
//   }, [eventsServicePlugin]);

//   const handleDeleteEvent = (eventId: number) => {
//     try {
//       // Remove event from the plugin
//       eventsServicePlugin.remove(eventId);

//       // Optionally update state
//       setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));

//       console.log("Event deleted:", eventId);
//       setSelectedEvent(null); // Close the modal if open
//     } catch (error) {
//       console.error("Error deleting event:", error);
//     }
//   };

//   // Configure the calendar app
//   const calendar = useCalendarApp({
//     views: [createViewWeek(), createViewMonthGrid()],
//     selectedDate: today,
//     plugins: [createEventModalPlugin(), createDragAndDropPlugin(), eventsServicePlugin],
//   });

//   return (
//     <div>
//       <ScheduleXCalendar calendarApp={calendar} />
//       {selectedEvent && (
//         <div className="modal">
//           <h3>Event Details</h3>
//           <p>Are you sure you want to delete this event?</p>
//           <p>Title: {selectedEvent.title}</p>
//           <p>Description: {selectedEvent.description}</p>
//           <p>Start Time: {selectedEvent.startTime}</p>
//           <p>End Time: {selectedEvent.endTime}</p>
//           <button
//             type="button"
//             onClick={() => handleDeleteEvent(selectedEvent.id)}
//             style={{ backgroundColor: "red", color: "white" }}
//           >
//             Delete
//           </button>
//           <button type="button" onClick={() => setSelectedEvent(null)}>
//             Cancel
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CalendarDisplay;

