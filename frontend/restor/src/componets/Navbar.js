import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll"; 

export default function Navbar({ onLoginClick }) { 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
  
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Ошибка при парсинге данных пользователя:", error);
      }
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    alert("Вы вышли из системы");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="navbar-links">
          <li><Link to="/">Главная</Link></li>
          <li><ScrollLink to="restaurants-section" smooth={true} duration={500} >Заведения</ScrollLink></li>
          <li><ScrollLink to="contact-section" smooth={true} duration={500} >Контакты</ScrollLink></li>
        </ul>

        <ul className="navbar-links">
          {user ? (
            <>
              <li><Link to="/bookings">Бронирования</Link></li>
              <li><Link to="/profile">{user.name}</Link></li>
              <li><button onClick={handleLogout} className="button">Выйти</button></li>
            </>
          ) : (
            <li><button onClick={onLoginClick} className="button">Войти</button></li> 
          )}
        </ul>
      </div>
    </nav>
  );
}
