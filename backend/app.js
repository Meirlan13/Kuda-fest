const express = require('express');
const { pool, postReviews, getReviews, getBookings, createOffer, bookOffer, getOffers, getDiscounts, getRestaurant } = require('./querries'); // Use queries.js for db connection and queries
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const twilio = require('twilio');
const app = express();
const flash = require('connect-flash');  
const port = 3001;



const accountSid = 'AC44ec817d81c2732180d95bbb1ea31045'; 
const authToken = '4337635c69eb9815ea74deaeced05ff3'; 
const client = twilio(accountSid, authToken);

const sendSms = (phoneNumber, restaurantName, bookingTime) => {
  const message = `Мы получили ваш запрос на бронь в ресторане "${restaurantName}" на ${bookingTime}.`;

  return client.messages.create({
      body: message,
      from: '+18145244775', // Номер Twilio
      to: phoneNumber // Номер телефона пользователя
  });
};



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, 
      secure: false,  
      },
  }));
  
  const cors = require("cors");
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
    usernameField: 'phone',    // define the parameter in req.body that passport can use as username and password
    passwordField: 'password'
},
    async (phone, password, done) => {
      console.log("Phone: ", phone); // Логируем email
      try {
        const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
        const user = result.rows[0];
  
        if (!user) {
          console.log("User not found"); // Логируем, если пользователь не найден
          return done(null, false, { message: 'User not found' });
        }
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          console.log("Password match"); // Логируем, если пароль совпал
          return done(null, user);
        } else {
          console.log("Invalid password"); // Логируем, если пароль не совпал
          return done(null, false, { message: 'Invalid password' });
        }
      } catch (err) {
        console.error("Error during authentication:", err); // Логируем ошибку
        return done(err);
      }
    }
  ));
  
  

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
      console.log("Десериализация пользователя с id:", id);
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      if (result.rows.length === 0) {
          console.log("Пользователь не найден");
          return done(null, false);
      }
      const user = result.rows[0];
      console.log("Пользователь загружен:", user);
      done(null, user);
  } catch (err) {
      console.error("Ошибка при десериализации пользователя:", err);
      done(err);
  }
});


app.post('/register', async (req, res) => {
    const { phone, name, password } = req.body;
  
    try {
      // Проверка, существует ли уже пользователь с таким email
      const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
      if (result.rows.length > 0) {
        return res.status(400).send({ message: 'Телефон уже зарегистрирован' });
      }
  
      // Хэширование пароля
      const hash = await bcrypt.hash(password, 10);
  
      // Регистрация нового пользователя
      const insertResult = await pool.query(
        'INSERT INTO users (phone, password, name) VALUES ($1, $2, $3) RETURNING *',
        [phone, hash, name]
      );
  
      const user = insertResult.rows[0];
      req.login(user, (err) => {
        if (err) {
          return res.status(500).send({ message: 'Ошибка при входе после регистрации' });
        }
        res.status(200).send({ message: 'Регистрация успешна', user });
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Ошибка при регистрации пользователя' });
    }
  });
  
  app.get('/restaurant/:restId', getRestaurant);
  
  app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }), (req, res) => {
    console.log('User logged in:', req.user); // Логируем, что пользователь вошел
    res.status(200).send({ message: 'Login successful', user: req.user });
  });
  
  app.get('/discounts/', getDiscounts);
  
app.get('/login', (req, res) => {
    const errorMessage = req.flash('error');  // Получаем сообщение об ошибке
    res.send(`<h1>Login Page</h1><p>${errorMessage}</p>`);
  });
  
app.get('/offers',getOffers);  

  app.get('/logout', (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).send({ message: 'Error logging out' });
  
      // Уничтожаем сессию явно
      req.session.destroy((err) => {
        if (err) return res.status(500).send({ message: 'Error destroying session' });
  
        // Удаляем куку сессии
        res.clearCookie('connect.sid'); 
        res.redirect('/');
      });
    });
  });
  
app.post('/book', bookOffer)

app.post('/createoffer', createOffer)

app.get('/bookings', async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Пользователь не аутентифицирован" });
}
    try {
      const userId = req.user.id;
      console.log('Получение бронирований для пользователя с id:', userId);
  
      const result = await getBookings(userId); // Получаем бронирования для пользователя
  
      if (result.rows.length === 0) {
        console.log('Бронирования не найдены для пользователя с id:', userId);
      } else {
        console.log('Найдено бронирований:', result.rows.length);
      }
  
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Ошибка при получении бронирований:', err); // Логируем ошибку
      res.status(500).send({ message: 'Error fetching bookings', error: err.message });
    }
  });

app.get('/reviews/:restaurantId', getReviews);

app.post('/postreview', postReviews);

  app.get('/track-order/:reservationToken', (req, res) => {
    const { reservationToken } = req.params;

    // Запрос для получения информации о бронировании с подключением к таблице offers и restaurants
    const query = `
        SELECT b.*, r.name AS restaurant_name
        FROM bookings b
        JOIN offers o ON b.offer_id = o.id
        JOIN restaurants r ON o.restaurant_id = r.id
        WHERE b.reservation_token = $1
    `;
    
    pool.query(query, [reservationToken], (err, result) => {
        if (err) {
            console.error("Ошибка при получении данных бронирования:", err);
            return res.status(500).json({ error: 'Ошибка при получении данных' });
        }

        const booking = result.rows[0];
        if (!booking) {
            return res.status(404).json({ error: 'Бронирование не найдено' });
        }

        // Возвращаем данные о бронировании, включая название ресторана
        res.json({
            restaurant_name: booking.restaurant_name,
            reserved_time: booking.reserved_time,
            status: booking.status,
        });
    });
});




app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
