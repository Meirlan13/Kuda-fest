import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function AdminPage() {
    const { restaurantId } = useParams();
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newDiscounts, setNewDiscounts] = useState({});


    const fetchDiscounts = async () => {
        if (!restaurantId) return;
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3001/discounts/${restaurantId}`, {
                withCredentials: true,
            });
            setDiscounts(response.data);
        } catch (error) {
            console.error("Ошибка загрузки скидок:", error);
            setError("Не удалось загрузить скидки");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchDiscounts();
    }, [restaurantId]);


    const handleUpdate = async (offerId) => {
        const discount = newDiscounts[offerId];
        if (discount === undefined || discount === "") {
            alert("Введите новое значение скидки");
            return;
        }

        try {
            await axios.post("http://localhost:3001/edit-restaurant", { offerId, discount }, {
                withCredentials: true,
            });
            alert("Скидка обновлена");
            fetchDiscounts(); 
        } catch (error) {
            console.error("Ошибка обновления скидки:", error);
            alert("Ошибка при обновлении");
        }
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h1>Админ панель - Управление скидками</h1>
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID предложения</th>
                        <th>Время</th>
                        <th>Текущая скидка</th>
                        <th>Новая скидка</th>
                        <th>Действие</th>
                    </tr>
                </thead>
                <tbody>
                    {discounts.map(discount => (
                        <tr key={discount.id}>
                            <td>{discount.id}</td>
                            <td>{discount.valid_time}</td>
                            <td>{discount.discount}%</td>
                            <td>
                                <input 
                                    type="number" 
                                    min="0" 
                                    max="70"
                                    value={newDiscounts[discount.id] || ""} 
                                    onChange={(e) => setNewDiscounts(prev => ({ ...prev, [discount.id]: e.target.value }))} 
                                />
                            </td>
                            <td>
                                <button onClick={() => handleUpdate(discount.id)}>Обновить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminPage;
