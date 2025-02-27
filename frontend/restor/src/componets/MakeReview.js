import { useState } from "react";
import axios from "axios";

function MakeReview({ restaurantId, user, onClose, refreshComments }) {
    const [foodRating, setFoodRating] = useState(5);
    const [serviceRating, setServiceRating] = useState(5);
    const [interiorRating, setInteriorRating] = useState(5);
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [isClosing, setIsClosing] = useState(false); // Для анимации
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        const reviewData = {
            user_id: user.id, 
            restaurant_id: restaurantId,
            food_rating: foodRating,
            service_rating: serviceRating,
            interior_rating: interiorRating,
            description: description
        };

        try {
            await axios.post("http://localhost:3001/postreview", reviewData);
            setMessage("Отзыв успешно отправлен!");

            // Очистка формы
            setFoodRating(5);
            setServiceRating(5);
            setInteriorRating(5);
            setDescription("");

            // Обновляем список отзывов
            refreshComments();

            // Запускаем анимацию перед закрытием
            closeWithAnimation();
        } catch (error) {
            console.error("Ошибка при отправке отзыва:", error);
            setMessage("Ошибка при отправке отзыва. Попробуйте снова.");
        }
    };

    const closeWithAnimation = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300); // Длительность анимации (должна совпадать с CSS)
    };

    return (
        <div className={`modal-overlay ${isClosing ? "modal-closing" : ""}`} onClick={closeWithAnimation}>
            <div className="review-form" onClick={(e) => e.stopPropagation()}>
                <h2>Оставить отзыв</h2>
                {message && <p>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <label>Имя: {user.name}</label>
                    <br/>
                    <label>
                        Оценка еды:
                        <input type="number" value={foodRating} onChange={(e) => setFoodRating(e.target.value)} min="0" max="5" required />
                    </label>
                    <br />
                    <label>
                        Оценка сервиса:
                        <input type="number" value={serviceRating} onChange={(e) => setServiceRating(e.target.value)} min="0" max="5" required />
                    </label>
                    <br />
                    <label>
                        Оценка интерьера:
                        <input type="number" value={interiorRating} onChange={(e) => setInteriorRating(e.target.value)} min="0" max="5" required />
                    </label>
                    <br />
                    <label>
                        Отзыв:
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </label>
                    <br />
                    <button type="submit">Отправить отзыв</button>
                    <button type="button" onClick={closeWithAnimation}>Закрыть</button>
                </form>
            </div>
        </div>
    );
}

export default MakeReview;

// import { useState } from "react";
// import axios from "axios";
// import "../Modal.css";

// function StarRating({ rating, setRating }) {
//     return (
//         <div className="star-rating">
//             {[1, 2, 3, 4, 5].map((star) => (
//                 <span
//                     key={star}
//                     className={star <= rating ? "star filled" : "star"}
//                     onClick={() => setRating(star)}
//                 >
//                     ★
//                 </span>
//             ))}
//         </div>
//     );
// }

// function MakeReview({ restaurantId, user, isOpen, onClose, refreshComments }) {
//     const [foodRating, setFoodRating] = useState(5);
//     const [serviceRating, setServiceRating] = useState(5);
//     const [interiorRating, setInteriorRating] = useState(5);
//     const [description, setDescription] = useState("");
//     const [message, setMessage] = useState("");
//     const [isClosing, setIsClosing] = useState(false);

//     if (!isOpen && !isClosing) return null;

//     const closeWithAnimation = () => {
//         setIsClosing(true);
//         setTimeout(() => {
//             setIsClosing(false);
//             onClose();
//         }, 300);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const reviewData = {
//             user_id: user.id,
//             restaurant_id: restaurantId,
//             food_rating: foodRating,
//             service_rating: serviceRating,
//             interior_rating: interiorRating,
//             description: description
//         };

//         try {
//             await axios.post("http://localhost:3001/postreview", reviewData);
//             setMessage("Отзыв успешно отправлен!");

//             setFoodRating(5);
//             setServiceRating(5);
//             setInteriorRating(5);
//             setDescription("");

//             refreshComments();

//             closeWithAnimation();
//         } catch (error) {
//             console.error("Ошибка при отправке отзыва:", error);
//             setMessage("Ошибка при отправке отзыва. Попробуйте снова.");
//         }
//     };

//     return (
//         <div className={`modal ${isClosing ? "modal-closing" : ""}`} onClick={closeWithAnimation}>
//             <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                 <h2>Оставить отзыв</h2>
//                 {message && <p className="success-text">{message}</p>}
//                 <form onSubmit={handleSubmit}>
//                     <label>Имя: {user.name}</label>

//                     <label>Оценка еды:</label>
//                     <StarRating rating={foodRating} setRating={setFoodRating} />

//                     <label>Оценка сервиса:</label>
//                     <StarRating rating={serviceRating} setRating={setServiceRating} />

//                     <label>Оценка интерьера:</label>
//                     <StarRating rating={interiorRating} setRating={setInteriorRating} />

//                     <label>Отзыв:</label>
//                     <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

//                     <button type="submit">Отправить отзыв</button>
//                     <button type="button" onClick={closeWithAnimation}>Закрыть</button>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default MakeReview;
