import { useState } from "react";
//import { useNavigate } from "react-router-dom";
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    password: "",
  });
  const [error, setError] = useState(null);
  //const navigate = useNavigate();

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
      credentials: "include",  // Важно, чтобы куки сессии передавались
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
  
    const data = await response.json();  // Получаем ответ от сервера
  
    if (!response.ok) {
      setError(data.message || "Something went wrong");
      return;
    }
  
    // Сохраняем данные пользователя в localStorage
    localStorage.setItem("user", JSON.stringify(data.user));  // data.user содержит данные, полученные с сервера
  
    alert(isLogin ? "Login successful!" : "Registration successful!");
  
    // Переадресация после успешного логина
    // window.location.href = "/bookings";  // Перенаправление на страницу бронирований
  };
  

  return (
    <div className="max-w-sm mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">{isLogin ? "Login" : "Register"}</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="phone"
          name="phone"
          placeholder="Номер телефона"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
          required
        />
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Имя"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            required
          />
        )}
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
          required
        />

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p className="mt-4 text-center">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button onClick={toggleMode} className="text-blue-500 ml-2">
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
}
