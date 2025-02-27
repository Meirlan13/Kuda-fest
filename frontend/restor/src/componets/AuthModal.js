import { useState } from "react";
import "../Modal.css"

function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    password: "",
  });
  const [error, setError] = useState(null);

  if (!isOpen && !isClosing) return null;

  const closeWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Должно совпадать с `hideModal`
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const url = `http://localhost:3001/${isLogin ? "login" : "register"}`;
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Что-то пошло не так");
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    alert(isLogin ? "Вход выполнен!" : "Регистрация успешна!");

    closeWithAnimation();
    window.location.reload();
  };

  return (
    <div className={`modal ${isClosing ? "modal-closing" : ""}`} onClick={closeWithAnimation}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isLogin ? "Вход" : "Регистрация"}</h2>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="phone"
            name="phone"
            placeholder="Номер телефона"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Имя"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        <p>
          {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}
          <button className="toggle-btn" onClick={toggleMode}>
            {isLogin ? "Регистрация" : "Войти"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
