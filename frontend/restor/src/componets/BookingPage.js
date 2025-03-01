import { useParams, useLocation, useNavigate } from "react-router-dom"; // Изменён импорт
import { useEffect, useState } from "react";
import Comments from './Comments';
import '../App.css';
import axios from "axios";

function BookingPage() {
    const { restaurantId } = useParams();
    const location = useLocation();
    const navigate = useNavigate(); // Используем useNavigate
    const [restaurant, setRestaurant] = useState(null);
    const [discounts, setDiscounts] = useState([]);
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setIsAuthenticated(true);
            setUser(storedUser);
            console.log("isAuthenticated:", true);
        }

        axios.get(`http://localhost:3001/restaurant/${restaurantId}`)
            .then(response => {
                setRestaurant(response.data[0] || null);
            })
            .catch(err => console.error("Ошибка загрузки ресторана:", err));
    }, [restaurantId]);

    useEffect(() => {
        axios.get(`http://localhost:3001/discounts`)
            .then(response => {
                setDiscounts(response.data);
            })
            .catch(err => {
                console.error("Ошибка получения скидок:", err);
            });
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const discountId = queryParams.get("discountId");
        if (discountId) {
            const discount = discounts.find(d => d.id === parseInt(discountId));
            setSelectedDiscount(discount || null);
        }
    }, [location.search, discounts]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDiscount) {
            alert("Выберите скидку перед бронированием!");
            return;
        }
    
        if (!isAuthenticated && (!phone || !email)) {
            alert("Введите телефон и email для бронирования!");
            return;
        }
    
        const bookingData = isAuthenticated
            ? { 
                userId: user.id, 
                offerId: selectedDiscount.id, 
                reservedTime: selectedDiscount.valid_time,
                restaurantName: restaurant?.name 
            }
            : { 
                offerId: selectedDiscount.id, 
                reservedTime: selectedDiscount.valid_time, 
                phone, 
                email,
                restaurantName: restaurant?.name 
            };
    
        console.log("Отправляем на сервер:", bookingData);
    
        try {
            const response = await axios.post("http://localhost:3001/book", bookingData);
            alert("Бронирование успешно!");

            // Редирект на страницу с отслеживанием статуса
            navigate(`/track-order/${response.data.reservationToken}`); // Заменили history.push на navigate
        } catch (error) {
            console.error("Ошибка при бронировании:", error);
            alert("Ошибка бронирования: " + (error.response?.data || "Попробуйте снова"));
        }
    };

    if (!restaurant) return <h2>Загрузка...</h2>;

    return (
        <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
            <div style={{ flex: 1, marginRight: '20px' }}>
                <h1>Бронирование в {restaurant?.name || "Неизвестный ресторан"}</h1>
                <p>Адрес: {restaurant?.location || "Нет данных"}</p>
                <img src={restaurant?.image_url} alt={restaurant?.name} style={{ width: '100%', height: 'auto' }} />
                <p>{restaurant?.description || "Описание ресторана"}</p>
            </div>
            <div style={{ flex: 1 }}>
                <form className="booking-form" onSubmit={handleSubmit}>
                    <h2>Форма бронирования</h2>
                    {discounts.filter(discount => discount.restaurant_id === restaurant.id).length > 0 && (
                        <div>
                            <label>
                                Выберите скидку:
                                <select
                                    value={selectedDiscount ? selectedDiscount.id : ""}
                                    onChange={(e) => {
                                        const selected = discounts.find(discount => discount.id === parseInt(e.target.value));
                                        setSelectedDiscount(selected || null);
                                    }}
                                    required
                                >
                                    <option value="">Выберите скидку</option>
                                    {discounts.filter(discount => discount.restaurant_id === restaurant.id).map((discount) => (
                                        <option key={discount.id} value={discount.id}>
                                            {discount.valid_time}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    )}
                    {!isAuthenticated && (
                        <>
                            <label>
                                Ваш номер телефона:
                                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            </label>
                            <label>
                                Ваш email:
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </label>
                        </>
                    )}
                    <button type="submit">Забронировать</button>
                </form>
                {isAuthenticated && user?.admin === restaurant?.id && (
    <button 
        onClick={() => navigate(`/edit-restaurant/${restaurant.id}`)} 
        style={{ backgroundColor: "red", color: "white", padding: "10px", border: "none", cursor: "pointer" }}
    >
        Редактировать скидки
    </button>
)}
            </div>
         </div>
         <Comments restaurantId={restaurantId} user={user} />
        </div>
    );
}

export default BookingPage;
