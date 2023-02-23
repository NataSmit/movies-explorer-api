require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { limiter } = require('./rateLimiter');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGO_URL } = require('./utils/config');

const options = {
  origin: [
    'http://localhost:3000',
    'http://movie.service.nomoredomains.xyz',
    'https://movie.service.nomoredomains.xyz',
    'http://api.movie.service.nomoredomains.xyz',
    'https://api.movie.service.nomoredomains.xyz',
    'https://github.com/NataSmit',
  ],
  credentials: true, // эта опция позволяет устанавливать куки
};

const { PORT = 3001 } = process.env;
const app = express();
app.use('*', cors(options));
app.use(helmet());

app.use(bodyParser.json());
app.use(cookieParser());

//mongoose.connect(MONGO_URL, {     // для подключения в вирт. машине yandex cloud
//  useNewUrlParser: true,
//});

mongoose.connect(MONGO_URL, {     // для heroku MONGO_URL changed to MONGO_URL_ONLINE!!!
  useNewUrlParser: true,
})
  .then((res) => console.log('Connected to DB'))
  .catch((err) => console.log(err))

app.use(requestLogger);
app.use(limiter);

app.use(router);

app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
