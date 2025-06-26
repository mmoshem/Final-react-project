import { useState } from "react";
import "./Auth.css";
import axios from "axios";

export default function UserRegisterForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [regMessage, setRegMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (e.target.password.value.length < 6) {
      alert("Password must be at least 6 characters long!");
    } else if (e.target.password.value !== e.target.confirmPassword.value) {
      alert("Passwords do not match!");
    } else {
      handleRegister();
    }
    // For now, just log the form data
    console.log("Registration attempt:", formData);
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/users", {
        command: "register",
        data: {
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          password: formData.password,
        },
      });

      setRegMessage(response.data.message || "Registration successful.");
      // Optionally clear fields
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      setRegMessage(
        "Error: " + (error.response?.data?.message || error.message)
      );
      ////
      // alert(regMessage);
      ///////
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div className="inside-register-container">
        {regMessage && (
        <div style={{
            fontSize: 22,
            color: regMessage.toLowerCase().includes("error") ? "red" : "green",
            }}
        >
        {regMessage}
        </div>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
            <input
                type="text"
                name="first_name"
                placeholder="first name"
                value={formData.first_name}
                onChange={handleChange}
                required
            />
            </div>
            <div className="form-group">
            <input
                type="text"
                name="last_name"
                placeholder="last name"
                value={formData.last_name}
                onChange={handleChange}
                required
            />
            </div>
            <div className="form-group">
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            </div>
            <div className="form-group">
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            </div>
            <div className="form-group">
            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
            />
            </div>
            <button type="submit" className="auth-button">
            Register
            </button>
        </form>
    </div>
  );
}
