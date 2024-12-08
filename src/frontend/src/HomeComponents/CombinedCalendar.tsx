import BotNavBar from "../BottomNavBar/BotNavBar";
import { NavBar } from "../HomeNav/NavBar";
import Combined2 from "./Combined2";
import UpcomingEvent from "./UpcomingEvent";
import "./CombinedCalendar.css";

function CombinedCalendar() {
  return (
    <div>
      <NavBar />
      <div className="combined-container">
        <ul><UpcomingEvent /></ul>
        <Combined2 />
      </div>
      <BotNavBar />
    </div>
  );
}

export default CombinedCalendar;
