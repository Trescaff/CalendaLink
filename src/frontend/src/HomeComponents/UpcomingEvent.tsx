import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../components/UserContext";
import "./UpcomingEvent.css";

interface Event {
  _id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: Date;
  username: string; // Includes the event's owner
}

interface GroupedEvents {
  date: string;
  events: Event[];
}

const groupEventsByDate = (events: Event[]): GroupedEvents[] => {
  const grouped: Record<string, Event[]> = {};

  events.forEach((event) => {
    const eventDate = event.date.toISOString().split("T")[0];
    if (!grouped[eventDate]) {
      grouped[eventDate] = [];
    }
    grouped[eventDate].push(event);
  });

  const sortedDates = Object.keys(grouped).sort();
  return sortedDates.map((date) => ({
    date,
    events: grouped[date].sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.startTime}`);
      const timeB = new Date(`1970-01-01T${b.startTime}`);
      return timeA.getTime() - timeB.getTime();
    }),
  }));
};

const UpcomingEvent: React.FC = () => {
  const { username } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const today = new Date();

        // Fetch combined events (groupmates' events)
        const combinedResponse = await axios.get(`https://localhost:5000/user/${username}/combined-events`);
        const combinedEvents = combinedResponse.data.map((event: any) => ({
          ...event,
          username: event.username,
          date: new Date(event.date),
        }));

        // Fetch user-specific events
        const userResponse = await axios.get(`https://localhost:5000/user/${username}/events`);
        const userEvents = userResponse.data.map((event: any) => ({
          ...event,
          username: username,
          date: new Date(event.date),
        }));

        // Combine both user and combined events
        const allEvents = [...userEvents, ...combinedEvents];

        // Filter for future and ongoing events
        const filteredEvents = allEvents.filter((event: Event) => {
          const eventEndDateTime = new Date(`${event.date.toISOString().split("T")[0]}T${event.endTime}`);
          return eventEndDateTime >= today; // Include ongoing and future events
        });

        console.log("User Events:", userEvents);
        console.log("Combined Events:", combinedEvents);
        console.log("All Filtered Events:", filteredEvents);

        setEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [username]);

  const groupedEvents = groupEventsByDate(events);

  return (
    <div className="upcoming-container">
      <div className="upcomingEvent">Upcoming Events</div>
      {loading ? (
        <p>Loading events...</p>
      ) : groupedEvents.length === 0 ? (
        <p>No upcoming events</p>
      ) : (
        groupedEvents.map((group) => (
          <div key={group.date} className="event-group">
            <h3 className="event-date">
              {new Date(group.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </h3>
            <ul className="upcoming-list">
              {group.events.map((event) => (
                <li className="upcoming-item" key={event._id}>
                  <div>
                    <p className="who">
                      {event.title} <span className="username">({event.username})</span>
                    </p>
                    <p className="when">
                      {event.startTime} - {event.endTime}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default UpcomingEvent;
