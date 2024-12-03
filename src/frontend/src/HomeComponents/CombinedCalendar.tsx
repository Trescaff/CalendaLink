import BotNavBar from "../BottomNavBar/BotNavBar";
import CalendarDisplay from "../Calendar/CalendarDisplay";
import { NavBar } from "../HomeNav/NavBar";
import Combined2 from "./Combined2";

function CombinedCalendar() {
  return (
    <div>
      <NavBar />
      <Combined2 />
      <BotNavBar />
    </div>
  );
}

export default CombinedCalendar;
