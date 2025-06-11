import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { useState } from 'react';
import axios from 'axios';

function LandingPage() {
  const navigate = useNavigate();

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [LogMessage, setLogMessage] = useState("");

 const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/users", {
        command: "Login",
        data: {
          email: email,
          password: password,
        },
      });

      setLogMessage(response.data.message);
      // Optionally clear fields
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setLogMessage(
        "Error: " + (error.response?.data?.message || error.message)
      );
      ////
      // alert(regMessage);
      ///
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister();
    console.log('Login attempt:', email,password);
  };

  
  return (
    <div className="landing-wrapper">
      <div className="landing-content">
         {LogMessage && (
        <div
          style={{
            fontSize: 22,
            color: LogMessage.toLowerCase().includes("error") ? "red" : "green",
          }}
        >
          {LogMessage}
        </div>
      )}
        <h1>Welcome to Our App</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email} 
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password} 
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div >
          <div className="button-group">
           <button type="submit" className="auth-button" on>Login</button>
            <button type="button" className="auth-button" onClick={() => navigate('/register')}>Registeration</button>
          </div >
        </form>
      </div>
    </div>
  )
}
export default LandingPage; 