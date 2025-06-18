// import React, { useState } from 'react';
// import './Auth.css';
// import axios from "axios";

// function Login() {
  
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });

//   const [loginResponse, setLoginResponse] = useState("");



//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };


// const handleLogIn = async () => {
//     try {
//       const response = await axios.post("http://localhost:5000/api/users", {
//         command: "Login",
//         data: {
//           email: formData.email,
//           password: formData.password,
//         },
//       });

//       setLoginResponse(response.data.message );
    
//     } catch (error) {
//       console.error(error);
//     }
//   };




//   const handleSubmit = (e) => {
//     e.preventDefault();
//     handleLogIn();
//     console.log('Login attempt:', formData);
//   };

  
//   return (
//     <div className="auth-container">
//       {regMessage && <div className="message">{regMessage}</div>}
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit} className="auth-form">
//         <div className="form-group">
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <button type="submit" className="auth-button">Login</button>
//       </form>
//     </div>
//   );
// }

// export default Login; 