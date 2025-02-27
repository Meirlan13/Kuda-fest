import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import MakeReview from './MakeReview'; // Форма для отзыва
import AuthModal from './AuthModal'; // Модальное окно авторизации
import '../App.css';

function Comments({ restaurantId, user, onLoginClick }) { 
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [showReviewModal, setShowReviewModal] = useState(false); // Окно отзыва
    const [showAuthModal, setShowAuthModal] = useState(false); // Окно авторизации

    const fetchComments = useCallback(() => {
        axios
            .get(`http://localhost:3001/reviews/${restaurantId}`, { withCredentials: true })
            .then((response) => {
                console.log("Ответ сервера:", response.data);
                setComments(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Ошибка при загрузке данных:", error);
                setError("Ошибка при загрузке данных");
                setLoading(false);
            });
    }, [restaurantId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]); 

    const handleLeaveReview = () => {
        if (!user) {
            setShowAuthModal(true); // Открываем модалку авторизации
        } else {
            setShowReviewModal(true); // Открываем модалку для отзыва
        }
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Отзывы</h2>
            <button onClick={handleLeaveReview}>Оставить отзыв</button>

            {/* Модалка для отзыва */}
            {showReviewModal && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-button" onClick={() => setShowReviewModal(false)}>×</button>
                        <MakeReview 
                            restaurantId={restaurantId} 
                            refreshComments={fetchComments} 
                            user={user} 
                            onClose={() => setShowReviewModal(false)} 
                        />
                    </div>
                </div>
            )}

            {/* Модалка для входа */}
            {showAuthModal && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />}

            {comments.length === 0 ? (
                <p>Отзывов пока нет</p>
            ) : (
                <ul>
                    {comments.map((comment, index) => (
                        <li key={index}>
                            <p><strong>{comment.name}:</strong> {comment.description}</p>
                            <p>Еда: {comment.food_rating}/5</p>
                            <p>Сервис: {comment.service_rating}/5</p>
                            <p>Интерьер: {comment.interior_rating}/5</p>
                            <p><small>Дата: {new Date(comment.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</small></p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Comments;
