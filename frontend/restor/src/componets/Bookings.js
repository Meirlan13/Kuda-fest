import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Bookings({ userId }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/bookings`, { withCredentials: true })
      .then((response) => {
        console.log("Ответ сервера:", response.data);
        setBookings(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке данных:", error);
        setError("Ошибка при загрузке данных");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Мои бронирования</h2>
      {bookings.length === 0 ? (
        <p>Нет бронирований</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.booking_id}>
              <img src={booking.image_url} alt={booking.restaurant_name} style={{ width: '100px', height: '100px' }} />
              <p>Ресторан: {booking.restaurant_name}</p>
              <p>Время бронирования: {booking.reserved_time}</p>
              <p>Статус: {booking.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Bookings;