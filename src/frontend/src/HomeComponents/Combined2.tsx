import React, { useEffect, useState, useRef } from "react";
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
    _id: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    date: Date;
    location?: string;
    category?: string;
    username: string;
  };

  const today = new Date().toISOString().split("T")[0];
  const eventsServicePlugin = React.useRef(createEventsServicePlugin()).current;
  const eventModal = createEventModalPlugin();

  const formatDate = (isoDate: string | Date) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const hasFetchedEvents = useRef(false);
  
  useEffect(() => {
    
    const fetchEvents = async () => {

      if (hasFetchedEvents.current) return;
      hasFetchedEvents.current = true;

      try {
        const response = await axios.get(`https://localhost:5000/user/${username}/combined-events`);

        const users: string[] = [username];

        // Clear existing events to avoid duplicates
        eventsServicePlugin.getAll().forEach((event) => {
          eventsServicePlugin.remove(event._id);
          console.log("Event removed:", event._id);
        });

        response.data.forEach((event: Event, index: number) => {
          if (!users.includes(event.username)) {
            users.push(event.username);
          }

          const calendarId = users.indexOf(event.username); 

          eventsServicePlugin.add({
            id: event._id,
            title: `${event.title} (${event.username})`,
            start: `${formatDate(new Date(event.date))} ${event.startTime}`,
            end: `${formatDate(new Date(event.date))} ${event.endTime}`,
            description: event.description,
            calendarId: calendarId.toString(),
          });
        });
      
        const response2 = await axios.get(`https://localhost:5000/user/${username}/events`);
        console.log("Events fetched:", response2.data);

        response2.data.forEach((event: any, index: number) => {
            eventsServicePlugin.add({
              id: event._id,
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
  }, [username]);

  const calendar = useCalendarApp({
    views: [createViewWeek(), createViewMonthGrid()],
    selectedDate: today,
    calendars: {
      0: { 
        colorName: "user1",
        lightColors: {
          main: "#1c7df9",
          container: "#d2e7ff",
          onContainer: "#002859",
        },
        darkColors: {
          main: "#c0dfff",
          onContainer: "#dee6ff",
          container: "#426aa2",
        },
       },
      1: { 
        colorName: "user2",
        lightColors: {
          main: "#c0dfff",
          onContainer: "#dee6ff",
          container: "#426aa2"
        },
        darkColors: {
          main: "#ffc0c0",
          onContainer: "#ffdede",
          container: "#a24242",
        },
       },
      2: { 
        colorName: "user3",
        lightColors: {
          main: "#f91c1c",
          container: "#ffd2d2",
          onContainer: "#590000",
        },
        darkColors: {
          main: "#fffcc0",
          onContainer: "#ffdede",
          container: "#a0a242",
        },
      },
      3: { 
        colorName: "user4",
        lightColors: {
          main: "#dcf91c",
          container: "#f8ffd2",
          onContainer: "#595900",
        },
        darkColors: {
          main: "#fffcc0",
          onContainer: "#ffdede",
          container: "#a0a242",
        },
      },
    },
    plugins: [
      createEventModalPlugin(),
      eventsServicePlugin,
      eventModal,
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
        </div>
      )}
    </div>
  );
}


export default Combined2;