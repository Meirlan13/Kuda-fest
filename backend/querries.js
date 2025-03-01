// queries.js
const { Pool } = require('pg');
const twilio = require('twilio');
const crypto = require('crypto');
const accountSid = 'AC44ec817d81c2732180d95bbb1ea31045'; 
const authToken = '4337635c69eb9815ea74deaeced05ff3'; 
const client = twilio(accountSid, authToken);


const sendSms = (phoneNumber, message) => {

  return client.messages.create({
      body: message,
      from: '+18145244775', // Номер Twilio
      to: phoneNumber // Номер телефона пользователя
  });
};

const pool = new Pool({
  user: 'meirs', // your username
  host: 'localhost',
  database: 'postgres', // your database name
  password: 'nomer321', // your password
  port: 5432,
});

// Example query to get bookings
const getBookings = (userId) => {
  return pool.query(`SELECT 
        b.id AS booking_id,
        r.name AS restaurant_name,
        r.image_url,
        b.status,
        b.reserved_time
     FROM bookings b
     JOIN offers o ON b.offer_id = o.id
     JOIN restaurants r ON o.restaurant_id = r.id
     WHERE b.user_id = $1`, [userId]);
};

const getReviews = (req,res) =>{
  const { restaurantId } = req.params;
  pool.query(`SELECT 
    reviews.food_rating, 
    reviews.service_rating, 
    reviews.interior_rating, 
    users.name, 
    reviews.description,
    reviews.created_at
FROM reviews
JOIN users ON reviews.user_id = users.id
WHERE reviews.restaurant_id = $1 
ORDER BY reviews.created_at DESC 
LIMIT 5;
`, [restaurantId],(err, result)=>{
  if(err){
    throw err
  }
  console.log(restaurantId);
  console.log('loging')
  return res.json(result.rows)
})
}

const postReviews = (req,res) =>{
  const { user_id, restaurant_id, food_rating, service_rating, interior_rating, description } = req.body;
  pool.query(`INSERT INTO reviews (user_id, restaurant_id, food_rating, service_rating, interior_rating, description) 
VALUES($1, $2, $3, $4, $5, $6);`, [user_id, restaurant_id, food_rating, service_rating, interior_rating, description], (err, result)=>{
  if (err) {
    console.error("Ошибка при добавлении отзыва:", err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
  return res.status(201).json({ message: "Отзыв успешно добавлен!" }); 
})
}

const createOffer = async (req, res) => {
    const { discount, valid_from, valid_untill } = req.body;
    // Получаем ID ресторана из данных пользователя, который является администратором
    const userAdmin = req.user.admin;  // Здесь предполагается, что adminn содержит ID ресторана
    // Проверяем, есть ли у пользователя роль администратора
    if (!userAdmin) {
      return res.status(403).send({ message: 'You do not have admin rights for any restaurant' });
    }
  
    try {
      // Вставляем новое предложение в таблицу offers, используя ID ресторана
      const result = await pool.query(
        'INSERT INTO offers (restaurant_id, discount, valid_from, valid_until) VALUES ($1, $2, $3, $4) RETURNING *',
        [userAdmin, discount, valid_from, valid_untill]
      );
  
      const offer = result.rows[0];
      res.status(201).send({ message: 'Offer created successfully', offer });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Error creating offer' });
    }
  };
  

// Функция для генерации случайного токена
function generateRandomToken() {
    return crypto.randomBytes(8).toString('hex'); // Генерация случайного токена
}

const bookOffer = (req, res) => {
    const { offerId, reservedTime, phone, name, restaurantName } = req.body;
    const userId = req.user ? req.user.id : req.body.userId || null; // Поддержка userId из body

    if (!offerId || !reservedTime || (!userId && (!phone || !name))) {
        return res.status(400).json({ error: "Некорректные данные бронирования" });
    }

    // Приводим reservedTime к формату HH:MM:SS
    const formattedTime = reservedTime.length === 5 ? reservedTime : reservedTime.slice(0, 5);

    const queryParams = [offerId, formattedTime];
    const reservationToken = generateRandomToken(); // Генерация случайного токена

    // Запрос в базу данных в зависимости от того, есть ли userId или только phone/email
    const queryText = userId
        ? `INSERT INTO bookings (user_id, offer_id, reserved_time, reservation_token) VALUES ($1, $2, $3, $4) RETURNING *`
        : `INSERT INTO bookings (offer_id, reserved_time, phone, name, reservation_token) VALUES ($1, $2, $3, $4, $5) RETURNING *`;

    const values = userId ? [userId, ...queryParams, reservationToken] : [...queryParams, phone, name, reservationToken];

    pool.query(queryText, values, async (err, result) => {
        if (err) {
            console.error("Ошибка при бронировании:", err);
            return res.status(500).json({ error: "Ошибка сервера" });
        }

        // Бронирование успешно создано
        const booking = result.rows[0];

        const trackingUrl = `http://localhost:3000/track-order/${reservationToken}`;

        // Отправляем SMS, если номер телефона предоставлен
        if (phone) {
          const message = `Ваше бронирование в ресторане ${restaurantName} на ${formattedTime}. Для отслеживания статуса перейдите по ссылке: ${trackingUrl}`;
            try {
                await sendSms(phone, message);
                console.log('Сообщение отправлено');
            } catch (error) {
                console.error('Ошибка отправки SMS:', error);
                // Не блокируем дальнейшее выполнение, даже если отправка SMS не удалась
            }
        }

        res.status(200).json({
            message: "Бронирование успешно!",
            booking,
            reservationToken, // Отправляем токен для отслеживания бронирования
        });
    });
};

const getOffers= (req,res)=>{
    pool.query(`SELECT id, name, type, location, image_url, description, latitude, longitude FROM restaurants;`, (err, result)=>{
        if(err){
            throw err;
        }
        res.json(result.rows);
    })
}

const getRestaurant = (req, res)=>{
    const { restId } = req.params;
    pool.query(`SELECT id, name, type, location, image_url, description, latitude, longitude FROM restaurants WHERE id = $1;`,[restId], (err,result)=>{
        if(err){
            throw err;
        }
        res.json(result.rows);
    })
}

const postOffers = async (req, res) => {
  try {
      const { offerId, discount } = req.body;
      const userId = req.user?.id;

      if (!offerId || discount === undefined) {
          return res.status(400).json({ error: "Необходимы offerId и discount" });
      }

      // Получаем admin_id ресторана, связанного с этим offerId
      const restaurantQuery = await pool.query(
          `SELECT r.admin_id FROM restaurants r 
           JOIN offers o ON r.id = o.restaurant_id 
           WHERE o.id = $1`,
          [offerId]
      );

      if (restaurantQuery.rowCount === 0) {
          return res.status(404).json({ error: "Ресторан или скидка не найдены" });
      }

      const restaurantAdminId = restaurantQuery.rows[0].admin_id;

      // Проверяем, является ли текущий пользователь админом этого ресторана
      if (Number(userId) !== Number(restaurantAdminId)) {
          return res.status(403).json({ message: "У вас нет прав на редактирование этой скидки" });
      }

      // Обновляем **discount**
      const updateQuery = await pool.query(
          `UPDATE offers SET discount = $1 WHERE id = $2 RETURNING *`,
          [discount, offerId]
      );

      res.json({ message: "Скидка обновлена", updatedOffer: updateQuery.rows[0] });

  } catch (error) {
      console.error("Ошибка при обновлении скидки:", error);
      res.status(500).json({ error: "Ошибка сервера" });
  }
};



const getRestaurantsDiscounts = async (req, res) => {
  try {
      const { restId } = req.params;
      const userId = req.user?.id;

      // Получаем admin_id ресторана
      const restaurantQuery = await pool.query(
          `SELECT admin_id FROM restaurants WHERE id = $1`,
          [restId]
      );

      if (restaurantQuery.rowCount === 0) {
          return res.status(404).json({ error: "Ресторан не найден" });
      }

      const restaurantAdminId = restaurantQuery.rows[0].admin_id;

      // Проверяем, является ли пользователь админом ресторана
      if (userId !== restaurantAdminId) {
          return res.status(403).json({ message: "У вас нет прав на просмотр скидок этого ресторана" });
      }

      // Получаем скидки ресторана
      const discountsQuery = await pool.query(
          `SELECT id, restaurant_id, discount, 
                  TO_CHAR(valid_time, 'HH24:MI') AS valid_time
           FROM offers
           WHERE restaurant_id = $1
           ORDER BY valid_time ASC`,
          [restId]
      );

      res.json(discountsQuery.rows);
  } catch (err) {
      console.error("Ошибка загрузки скидок:", err);
      res.status(500).json({ error: "Ошибка базы данных" });
  }
};


const getDiscounts = (req,res)=>{ 
    pool.query(`SELECT id, restaurant_id, discount, TO_CHAR(valid_time, 'HH24:MI') AS valid_time
FROM offers
WHERE is_archived = false 
AND valid_time > NOW()::TIME  -- Приводим NOW() к типу TIME
ORDER BY valid_time ASC;`,(err,result)=>{
        if(err){
            throw err
        }
        res.json(result.rows);  
    })
}



module.exports = { pool,postOffers, getRestaurantsDiscounts, getBookings, createOffer, bookOffer, getOffers ,getDiscounts, getRestaurant, getReviews, postReviews };
