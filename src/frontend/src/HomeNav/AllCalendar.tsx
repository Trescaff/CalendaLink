import BotNavBar from "../BottomNavBar/BotNavBar";
import { NavBar } from "./NavBar";
import CalendarsList from "./CalendarsList";

function AllCalendar() {
  return (
    <div>
      <NavBar />
      <h1>All Calendar</h1>
      <CalendarsList />
      <BotNavBar />
    </div>
  );
}

export default AllCalendar;
