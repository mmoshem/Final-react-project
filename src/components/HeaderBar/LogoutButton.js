import { useNavigate } from 'react-router-dom';
import './LogoutButton.css';

export default function LogoutButton({ onLogout }) {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userProfileImage");
        onLogout?.();
        navigate("/", { replace: true });
    };

    return (
        <button
            onClick={handleLogout}
            className="logout-button pill-button"
        >
            <div className="button-content">
                <div className="button-text">Logout</div>
            </div>
        </button>
    );
}