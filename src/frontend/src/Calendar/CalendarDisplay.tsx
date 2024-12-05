import React, { useEffect, useState } from "react";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import axios from "axios";
import { useUser } from "../components/UserContext";
import DeleteButton from "../components/DeleteButton";

function CalendarDisplay() {

  const { username } = useUser();

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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  // Initialize the events service plugin (useRef to persist instance)
  const eventsServicePlugin = React.useRef(createEventsServicePlugin()).current;
   
  useEffect(() => {
    // Fetch events from your API and add them to the events service
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`https://localhost:5000/user/${username}/events`);
        console.log("Events fetched:", response.data);

        // Clear existing events to avoid duplicates
        eventsServicePlugin.getAll().forEach((event) => {
          eventsServicePlugin.remove(event.id);
        });
  
        response.data.forEach((event: any) => {
          eventsServicePlugin.add({
            id: event.id,
            title: event.title,
            start: `${formatDate(new Date(event.date))} ${event.startTime}`,
            end: `${formatDate(new Date(event.date))} ${event.endTime}`,
            description: event.description,
          });
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    fetchEvents();
  }, []);

//   const handleDeleteEvent = async () => {
//     if (selectedEvent) {
//       try {
//         eventsServicePlugin.remove(selectedEvent.id);
//         await axios.delete(`https://localhost:5000/user/${username}/${selectedEvent.id}`);
//         setEvents((prevEvents) => prevEvents.filter((event) => event.id !== selectedEvent.id));
//         setSelectedEvent(null);
//         console.log("Event deleted:", selectedEvent.id);
//       } catch (error) {
//         console.error("Error deleting event:", error);
//       }
//     }
//   }; 

//   // Configure the calendar app
//  const calendar = useCalendarApp({
//     views: [createViewWeek(), createViewMonthGrid()],
//     selectedDate: today,
//     plugins: [
//       createEventModalPlugin(),
//       eventsServicePlugin,
//     ],
//   });
  
//   const getEventIndex = (id: number) => {
//     const allEvents = eventsServicePlugin.getAll();
//     const index = allEvents.findIndex((event) => event.id ===id);
//     if (index === -1) {
//       console.error("Event error");
//     } else {
//       console.log('Index of event ID ${id}', index);
//     }
//     return index;
//   };

//   getEventIndex( 2);
  
//   const modalStyle: React.CSSProperties = {
//     position: "fixed",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     background: "white",
//     padding: "20px",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//     zIndex: 1000,
//   }
  
//   const buttonStyle: React.CSSProperties = {
//     margin: "10px",
//   }
  
//   return (
//     <div>
//       <ScheduleXCalendar calendarApp={calendar} />
//       {selectedEvent && (
//         <div style={modalStyle}>
//           <h3>Edit Event</h3>
//           <p>Are you sure you want to delete this event?</p>
//           <p>Title: {selectedEvent.title}</p>
//           <p>Description: {selectedEvent.description}</p>
//           <p>Start Time: {selectedEvent.startTime}</p>
//           <p>End Time: {selectedEvent.endTime}</p>
//           <DeleteButton onClick={handleDeleteEvent} />
//           <button type="button" onClick={() => setSelectedEvent(null)}>
//             Cancel
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


// export default CalendarDisplay;

const handleDeleteEvent = async () => {
  if (selectedEvent) {
    try {
      // Delete the event from the server
      await axios.delete(`https://localhost:5000/user/${username}/${selectedEvent.id}`);
      eventsServicePlugin.remove(selectedEvent.id);
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== selectedEvent.id));
      setSelectedEvent(null);
      setShowDeletePopup(false);
      console.log("Event deleted:", selectedEvent.id);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }
};

return (
  <div>
    <ScheduleXCalendar calendarApp={useCalendarApp({
      views: [createViewWeek(), createViewMonthGrid()],
      selectedDate: today,
      plugins: [eventsServicePlugin],
    })} />

    {/* Event List */}
    <div>
      <h2>Your Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <button
              onClick={() => {
                setSelectedEvent(event);
                setShowDeletePopup(true);
              }}
            >
              {event.title} - {event.date.toString().slice(0, 10)} ({event.startTime} to {event.endTime})
            </button>
          </li>
        ))}
      </ul>
    </div>

    {/* Delete Confirmation Popup */}
    {showDeletePopup && selectedEvent && (
      <div className="delete-popup">
        <div className="popup-content">
          <h3>Are you sure you want to delete this event?</h3>
          <p>Title: {selectedEvent.title}</p>
          <p>Description: {selectedEvent.description}</p>
          <p>
            Date: {selectedEvent.date.toString().slice(0, 10)} | Time: {selectedEvent.startTime} -{" "}
            {selectedEvent.endTime}
          </p>
          <div className="button-container">
            <button onClick={handleDeleteEvent}>Yes</button>
            <button
              className="cancel"
              onClick={() => {
                setShowDeletePopup(false);
                setSelectedEvent(null);
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}

export default CalendarDisplay;