import BotNavBar from "../BottomNavBar/BotNavBar";
import { NavBar } from "./NavBar";
import CalendarsList from "./CalendarsList";

function AllCalendar() {
  return (
    <div>
      <NavBar />
      <CalendarsList />
      <BotNavBar />
    </div>
  );
}

export default AllCalendar;
