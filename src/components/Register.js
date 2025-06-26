import { useState, useEffect } from "react";
import "./Auth.css";
import UserRegisterForm from "./UserRegisterForm";
import CompanyRegisterForm from "./CompanyRegisterForm";
function Register() {
  const [userType, setUserType] = useState("user"); // Default to 'user' // 'company' can be set based on radio button selection

  useEffect(() => {
    // This effect can be used to reset the message after a certain time or on unmount
  }, [userType]);

  const handleRadio = (event) => {
    setUserType(event.target.value);
  };

  return (
    <div className="landing-wrapper">
      <div className="register-container">
        <h2>Register</h2>
        <label className="small-space">
          <input
            type="radio"
            name="userType"
            value="user"
            defaultChecked={true}
            onChange={handleRadio}
          />
          user
        </label>
        <label>
          <input
            type="radio"
            name="userType"
            value="company"
            onChange={handleRadio}
          />
          company
        </label>
            {userType === 'user' ? <UserRegisterForm /> : <CompanyRegisterForm />}

      </div>
    </div>
  );
}

export default Register;
