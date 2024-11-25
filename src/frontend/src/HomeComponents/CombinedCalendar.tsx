import BotNavBar from "../BottomNavBar/BotNavBar";
import CalendarDisplay from "../Calendar/CalendarDisplay";
import { NavBar } from "../HomeNav/NavBar";

function CombinedCalendar() {
  return (
    <div>
      <NavBar />
      <CalendarDisplay />
      <BotNavBar />
    </div>
  );
}

export default CombinedCalendar;
