import { Link } from "react-router-dom";
import { NavBar } from "./NavBar";
import BotNavBar from "../BottomNavBar/BotNavBar";

function Setting() {
  return (
    <div>
      <NavBar />
      <h1>Setting</h1>
      <Link to="/">Logout</Link>
      <BotNavBar />
    </div>
  );
}

export default Setting;
