import React from "react";
import "./UpcomingEvent.css";

interface Event {
  who: string;
  when: string; 
}

interface UpcomingEventProps {
  events: Event[];
}

const groupEventsByDate = (events: Event[]) => {
  // Group events by date
  const grouped: Record<string, Event[]> = {};
  events.forEach((event) => {
    const [date] = event.when.split(" "); // Extract the date
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(event);
  });

  const sortedDates = Object.keys(grouped).sort();
  sortedDates.forEach((date) => {
    grouped[date].sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.when.split(" ")[1]}`); 
      const timeB = new Date(`1970-01-01T${b.when.split(" ")[1]}`);
      return timeA.getTime() - timeB.getTime();
    });
  });

  return sortedDates.map((date) => ({ date, events: grouped[date] }));
};

const UpcomingEvent: React.FC<UpcomingEventProps> = ({ events }) => {
  const groupedEvents = groupEventsByDate(events);

  return (
    <div className="upcoming-container">
      <div className="upcomingEvent">Upcoming Events</div>
      {groupedEvents.map((group) => (
        <div key={group.date} className="event-group">
          <h3 className="event-date">{group.date}</h3>
          <ul className="upcoming-list">
            {group.events.map((event, index) => (
              <li className="upcoming-item" key={index}>
                <div>
                  <p className="who">{event.who}</p>
                  <p className="when">{event.when.split(" ")[1]}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const Events: React.FC = () => {
  const events = [
    { who: "makan(chew)", when: "2024-12-05 10:00" },
    { who: "testing 2 (afqmni)", when: "2024-12-06 16:00" },
    { who: "penat (ofqmni)", when: "2024-12-06 18:00" },
    { who: "tidur (chew)", when: "2024-12-07 20:00" },
  ];

  return <UpcomingEvent events={events} />;
};

export default Events;
