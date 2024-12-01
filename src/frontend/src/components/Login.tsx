import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      setMessage(response.data.message);
      if(response.status === 200) {
        navigate("/Home", { state: { username } });
        }
      } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data.message || "An error occurred");
      } else {
        setMessage("An unexpected error occurred");
        alert(message);
      }
    }
  };

  return (
    <div className="login-register">
      <div className="wrapper">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className="input-box">
            <input 
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required></input>
          </div>
          <div className="input-box">
            <input 
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required></input>
          </div>
          <div className="remember-forget">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
          </div>
          <button type="submit">Login</button>
          {message && <p>{message}</p>}
          <div className="register-link">
            <p>
              Don't have an account? <Link to="/Register">Register</Link>
            </p>
          </div>
          <Link to="/Home">Home</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
