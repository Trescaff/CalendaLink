import { Link } from "react-router-dom";
import "./BotNavBar.css";

function BotNavBar() {
  return (
    <div className="bot-nav-bar">
      <Link to="/About">CalendaLink</Link>
    </div>
  );
}

export default BotNavBar;
