import BotNavBar from "../BottomNavBar/BotNavBar";
import CalendarDisplay from "../Calendar/CalendarDisplay";
import { NavBar } from "../HomeNav/NavBar";
import Combined2 from "./Combined2";
import "./CombinedCalendar.css";

function CombinedCalendar() {
  return (
    <div>
      <NavBar />
      <div className="combined-container">
        <ul>
        <Combined2 />
        </ul>
      </div>
      <BotNavBar />
    </div>
  );
}

export default CombinedCalendar;
