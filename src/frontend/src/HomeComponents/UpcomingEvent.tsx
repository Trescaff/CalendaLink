import React from "react";
import "./UpcomingEvent.css";

interface Event {
    who: string;
    when: string;
  }
  
  interface UpcomingEventProps {
    events: Event[];
  }
  
  const UpcomingEvent: React.FC<UpcomingEventProps> = ({ events }) => {
    return (
      <div className="upcoming-container">
        <div className="upcomingEvent">Upcoming Event</div>
        <ul className="upcoming-list">
          {events.map((event, index) => (
            <li className="upcoming-item" key={index}>
              <div>
                <p className="who">{event.who}</p>
                <p className="when">{event.when}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const Events: React.FC = () => {
    const events = [
      { who: "makan(chew)", when: "2024-12-05" },
      { who: "testing 2 (afqmni)", when: "2024-12-06" },
      { who: "penat (ofqmni)", when: "2024-12-07" }, //cepatnya iqa penat
    ];
  
    return <UpcomingEvent events={events} />;
  };
  
  export default Events;
  