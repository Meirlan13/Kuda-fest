import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function TrackBooking() {
    const { reservationToken } = useParams();  // Получаем токен из URL
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Получаем данные о бронировании с сервера
        axios.get(`http://localhost:3001/track-order/${reservationToken}`)
            .then(response => {
                setBooking(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError("Не удалось найти бронирование. Возможно, токен недействителен.");
                setLoading(false);
            });
    }, [reservationToken]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
    const formattedTime = booking.reserved_time.length === 5 ? booking.reserved_time : booking.reserved_time.slice(0, 5);

return (
    <div className="tracking-container">
        <h1>Статус бронирования</h1>
        <div className="booking-details">
            <p><strong>Ресторан:</strong> {booking.restaurant_name}</p>
            <p><strong>Время бронирования:</strong> {formattedTime}</p>
            <p><strong>Статус:</strong> {booking.status}</p>
        </div>
    </div>
);

}

export default TrackBooking;
