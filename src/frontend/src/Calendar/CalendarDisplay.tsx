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
    _id: number;
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
  const eventModal = createEventModalPlugin();
   
  useEffect(() => {
    // Fetch events from your API and add them to the events service
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`https://localhost:5000/user/${username}/events`);
        console.log("Events fetched:", response.data);

        // Clear existing events to avoid duplicates
        eventsServicePlugin.getAll().forEach((event) => {
          eventsServicePlugin.remove(event._id);
        });
  
        response.data.forEach((event: Event) => {
          eventsServicePlugin.add({
            id: event._id,
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

const handleDeleteEvent = async (eventId: number) => {
  try {
    // Delete the event from the server
    await axios.delete(`https://localhost:5000/user/${username}/${eventId}`);
    eventsServicePlugin.remove(eventId);
    setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
    setSelectedEvent(null);
    setShowDeletePopup(false);
  } catch (error) {
    console.error("Error deleting event:", error);
  }
};

const handleEventClick = (event: Event) => {
  setSelectedEvent(event); // Correctly set the selected event
  setShowDeletePopup(true); // Show the delete popup
};

return (
  <div>
    <ScheduleXCalendar calendarApp={useCalendarApp({
      views: [createViewWeek(), createViewMonthGrid()],
      selectedDate: today,
      plugins: [eventsServicePlugin, eventModal],
    })} />

    {/* Event List */}
    <div>
      <h2>Select event to delete</h2>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <button onClick={() => {
              handleEventClick(event);
            }}>
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
            <button onClick={() => {
              handleDeleteEvent(selectedEvent._id);
              setShowDeletePopup(false);
            }}>Yes</button>
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