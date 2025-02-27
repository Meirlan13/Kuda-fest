import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function Restaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    // Состояние для ref каждого контейнера скидок
    const discountRefs = useRef([]);

    useEffect(() => {
        axios.get("http://localhost:3001/offers")
            .then(response => {
                setRestaurants(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        axios.get("http://localhost:3001/discounts")
            .then(response => {
                setDiscounts(response.data);
            })
            .catch(err => {
                console.error("Ошибка получения скидок:", err);
            });
    }, []);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                },
                (error) => {
                    console.error("Ошибка получения геолокации:", error.message);
                }
            );
        } else {
            console.log("Геолокация не поддерживается этим браузером.");
        }
    }, []);

    const sortedRestaurants = userLocation
        ? [...restaurants].sort((a, b) => {
              const distanceA = a.latitude && a.longitude
                  ? calculateDistance(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude)
                  : Infinity;
              const distanceB = b.latitude && b.longitude
                  ? calculateDistance(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude)
                  : Infinity;

              return distanceA - distanceB;
          })
        : restaurants;

    if (loading) return <h2>Загрузка...</h2>;
    if (error) return <h2>Ошибка: {error}</h2>;

    // Функция прокрутки влево
    const scrollLeft = (index) => {
        if (discountRefs.current[index]) {
            discountRefs.current[index].scrollBy({
                left: -200,
                behavior: "smooth",
            });
        }
    };

    // Функция прокрутки вправо
    const scrollRight = (index) => {
        if (discountRefs.current[index]) {
            discountRefs.current[index].scrollBy({
                left: 200,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="home-container">
            <h1>Рестораны</h1>
            <div className="restaurant-list">
                {sortedRestaurants.map((restaurant, index) => {
                    const distance = userLocation && restaurant.latitude && restaurant.longitude
                        ? calculateDistance(
                              userLocation.latitude,
                              userLocation.longitude,
                              restaurant.latitude,
                              restaurant.longitude
                          ).toFixed(2)
                        : null;
                        
                    return (
                        <div key={restaurant.id} className="restaurant-card">
                            <Link to={`/booking/${restaurant.id}`}>
                                <img src={restaurant.image_url} alt={restaurant.name} />
                            </Link>
                            <div className="restaurant-info">
                                <h3>{restaurant.name}</h3>
                                <p>{restaurant.location}</p>
                                <p>{restaurant.description}</p>
                                {distance && <p>Расстояние: {distance} км</p>}

                                <div className="discount-scroll-container" ref={(el) => discountRefs.current[index] = el}>
                                    {discounts.filter(discount => discount.restaurant_id === restaurant.id).length > 0 ? (
                                        discounts
                                            .filter(discount => discount.restaurant_id === restaurant.id)
                                            .map((discount) => (
                                                <div key={discount.id} className="discount-item">
                                                    <Link 
                                                        to={`/booking/${restaurant.id}?discountId=${discount.id}`} 
                                                        className="discount-link"
                                                    >
                                                        {discount.valid_time}
                                                    </Link>
                                                    {/* <span className="discount-time">{discount.valid_time}</span> */}
                                                </div>
                                            ))
                                    ) : (
                                        <p className="no-discount">Скидок пока нет</p>
                                    )}
                                </div>
                                <div>
                                    <button className="scroll-button" onClick={() => scrollLeft(index)}>‹</button>
                                    <button className="scroll-button" onClick={() => scrollRight(index)}>›</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Restaurants;
