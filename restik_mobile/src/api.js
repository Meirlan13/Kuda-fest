const API_URL = "http://localhost:3001"; // Укажи адрес своего бэкенда

export const getOffers = async () => {
  try {
    const response = await fetch(`${API_URL}/offers`);
    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении предложений:", error);
    return [];
  }
};

export const bookOffer = async (offerId, userId) => {
  try {
    const response = await fetch(`${API_URL}/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offerId, userId }),
    });
    return await response.json();
  } catch (error) {
    console.error("Ошибка при бронировании:", error);
    return null;
  }
};
