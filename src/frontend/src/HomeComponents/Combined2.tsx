import React, { useEffect, useState } from "react";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import axios from "axios";
import { useUser } from "../components/UserContext";
import DeleteButton from "../components/DeleteButton";

function Combined2() {

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
    username: string;
  };

  // Get today's date in the required format (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];
  const eventsServicePlugin = React.useRef(createEventsServicePlugin()).current;

  // Step 1: Define colors for each calendarId
  const colorMapping = [
    "#FF5733", // calendarId 0 → Red
    "#33FF57", // calendarId 1 → Green
    "#3357FF", // calendarId 2 → Blue
    "#FF33A1", // calendarId 3 → Pink
  ];

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
  // Initialize the events service plugin (useRef to persist instance)
  //const eventsServicePlugin = React.useRef(createEventsServicePlugin()).current;
  
  useEffect(() => {
    // Fetch events from your API and add them to the events service
    
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${username}/combined-events`);
        console.log("Combined events fetched:", response.data);

        const users: string[] = [];

        // Clear existing events to avoid duplicates
        eventsServicePlugin.getAll().forEach((event) => {
          eventsServicePlugin.remove(event.id);
        });

        response.data.forEach((event: Event, index: number) => {
          if (!users.includes(event.username)) {
            users.push(event.username);
          }

          const calendarId = users.indexOf(event.username); // Get calendarId for this username
          const eventColor = colorMapping[calendarId]; //|| "#CCCCCC"; 

          eventsServicePlugin.add({
            id: event.id,
            title: `${event.title} (${event.username})`,
            start: `${formatDate(new Date(event.date))} ${event.startTime}`,
            end: `${formatDate(new Date(event.date))} ${event.endTime}`,
            description: event.description,
            //className: userClass, // Dynamically assign the class
            //calendarId: users.indexOf(event.username).toString(),
            calendarId: calendarId.toString(),
            backgroundColor: eventColor,
          });
        });
      
        const response2 = await axios.get(`http://localhost:5000/user/${username}/events`);
        console.log("Events fetched:", response2.data);

        response2.data.forEach((event: any, index: number) => {
            eventsServicePlugin.add({
              id: event.id,
              title: `${event.title} (${username})`,
              start: `${formatDate(new Date(event.date))} ${event.startTime}`,
              end: `${formatDate(new Date(event.date))} ${event.endTime}`,
              description: event.description,
            });
          });

      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    
    fetchEvents();
  }, [username, eventsServicePlugin]);

        /*
        response.data.forEach((event: Event) => {
          // Set CSS variable for the username dynamically
          const userColor =
            colorMapping[event.username] || colorMapping.default;

          document.documentElement.style.setProperty(
            `--sx-color-primary-container`,
            userColor
          );

          // Add event
          eventsServicePlugin.add({
            id: event.id,
            title: `${event.title} (${event.username})`,
            start: event.startTime,
            end: event.endTime,
            description: event.description,
          });
        });
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [username, eventsServicePlugin]);
  */
        

        /*
        response.data.forEach((event: any, index: number) => {
          if (!users.includes(event.username)) {
            users.push(event.username);
          }
          eventsServicePlugin.add({
            id: event.id,
            title: `${event.title} (${event.username})`,
            start: `${formatDate(new Date(event.date))} ${event.startTime}`,
            end: `${formatDate(new Date(event.date))} ${event.endTime}`,
            description: event.description,
            calendarId: users.indexOf(event.username).toString(),
          });
        });
      
        const response2 = await axios.get(`http://localhost:5000/user/${username}/events`);
        console.log("Events fetched:", response2.data);

        response2.data.forEach((event: any, index: number) => {
            eventsServicePlugin.add({
              id: event.id,
              title: `${event.title} (${username})`,
              start: `${formatDate(new Date(event.date))} ${event.startTime}`,
              end: `${formatDate(new Date(event.date))} ${event.endTime}`,
              description: event.description,
            });
          });

      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    
    fetchEvents();
  }, []);
  */

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        eventsServicePlugin.remove(selectedEvent.id);
        await axios.delete(`http://localhost:5000/calendar/remove/${username}/${selectedEvent.id}`);
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== selectedEvent.id));
        setSelectedEvent(null);
        console.log("Event deleted:", selectedEvent.id);
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  }; 

  // Configure the calendar app
  const calendar = useCalendarApp({
    views: [createViewWeek(), createViewMonthGrid()],
    selectedDate: today,
    plugins: [
      createEventModalPlugin(),
      eventsServicePlugin,
    ],
  });

  const modalStyle: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
  }
  
  const buttonStyle: React.CSSProperties = {
    margin: "10px",
  }
  
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
          <DeleteButton onClick={handleDeleteEvent} />
          <button type="button" onClick={() => setSelectedEvent(null)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}


export default Combined2;