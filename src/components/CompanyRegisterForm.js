import { useState } from "react";
import axios from "axios";
import "./Auth.css";

export default function CompanyRegisterForm() {
const [formData, setFormData] = useState({
    company_name: "",
    company_email: "",
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
      const response = await axios.post("http://localhost:5000/api/companies", {
        command: "register",
        data: {
          company_name: formData.company_name,
          company_email: formData.company_email,
          password: formData.password,
        },
      });

      setRegMessage(response.data.message || "Registration successful.");
      // Optionally clear fields
      setFormData({
        company_name: "",
        company_email:"",
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
    <div className="auth-container">
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
                name="company_name"
                placeholder="company name"
                value={formData.company_name}
                onChange={handleChange}
                required
            />
            </div>
            <div className="form-group">
            <input
                type="email"
                name="company_email"
                placeholder="company email"
                value={formData.company_email}
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