import UserCard from "../components/UserCard";
import { NavBar } from "../HomeNav/NavBar";
import "./About.css";
import BotNavBar from "./BotNavBar";

const About = () => {
  return (
    <div>
      <NavBar />
      <div className="usercard">
        <UserCard />
      </div>
      <BotNavBar />
    </div>
  );
};

export default About;
