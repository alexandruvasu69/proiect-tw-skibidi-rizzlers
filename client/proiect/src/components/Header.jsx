import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCheckTokenLoading, setLoggedIn, setRole, setToken, setUserId } from "../store/slices/globalSlice";
import './header.css';

function Header() {
    const { loggedIn } = useSelector(state => state.global);
    const navigator = useNavigate();
    const dispatch = useDispatch();

    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [
        { id: 1, text: "Notificare importantă" },
        { id: 2, text: "Articolul tău a fost aprobat" },
        { id: 3, text: "Articol respins, necesită modificări" },
        { id: 4, text: "Urmează o nouă conferință" },
    ];

    const toggleNotifications = () => {
        setShowNotifications(prev => !prev);
    };

    const handleLogOut = () => {
        localStorage.removeItem("token");
        dispatch(setLoggedIn(false));
        dispatch(setCheckTokenLoading(true));
        dispatch(setToken(null));
        dispatch(setRole(null));
        dispatch(setUserId(null));
        navigator("/login");
    }

    return <header>
        <div className="container">
            <div className="logo" onClick={() => navigator("/")}>
                <i className="fas fa-laptop-code"></i>
                <h1>Conferințe IT</h1>
            </div>
            <nav>
                <ul>
                    <li><p onClick={() => navigator("/")}>Acasa</p></li>
                    { !loggedIn && <li><a href="/login" className="btn">Login</a></li> }
                    {loggedIn && (
                    <li className="notifications-container">
                        <button className="notifications-btn" onClick={toggleNotifications}>
                        <i className="fas fa-bell"></i>
                        </button>
                        {showNotifications && (
                        <div className="notifications-panel">
                            <h4>Notificări</h4>
                            {notifications.length === 0 ? (
                            <p className="no-notifs">Nu există notificări</p>
                            ) : (
                            notifications.map(notification => (
                                <div key={notification.id} className="notification-item">
                                {notification.text}
                                </div>
                            ))
                            )}
                        </div>
                        )}
                    </li>
                    )}
                    {loggedIn && (
                        <li>
                            <button className="logout-btn" onClick={handleLogOut}>Logout</button>
                        </li>
                    )}
                </ul>
            </nav>
        </div>
    </header>
}

export default Header;