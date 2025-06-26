import { useNavigate } from 'react-router-dom';

export default function LogoutButton({ onLogout }) {
    const navigate = useNavigate();
    
    
    const handleLogout = () => {
    localStorage.removeItem("userEmail"); // or any user info you stored
    onLogout?.(); // optional
    navigate("/", { replace: true });
    };
  
  
    return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600"
    >
      Logout
    </button>
  );
}




