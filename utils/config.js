const MONGO_DEFAULT_URL = 'mongodb://localhost:27017/moviesdb';
module.exports.MONGO_URL = process.env.MONGO_URL_ONLINE || MONGO_DEFAULT_URL;
module.exports.SECRET_KEY = 'top-secret-key';

module.exports.errorMessage = {
  userNotFound: 'Запрашиваемый пользователь не найден',
  dataNotCorrectByUpdate: 'Переданы некорректные данные при обновлении пользователя',
  dataNotCorrectByCreation: 'Переданы некорректные данные при создании пользователя',
  emailExists: 'Указанный email уже существует',
  loginInfoNotCorrect: 'Неправильные почта или пароль',
  dataNotCorrectByFilmCreation: 'Переданы некорректные данные при создании фильма',
  filmDoesNotexist: 'Фильм не существует',
  noPermissionToDeleteFilm: 'Нет прав для удаления фильма',
  filmDeleted: 'Фильм успешно удален',
  filmNotFound: 'Фильм не найден (некорректный id)',
};

module.exports.info = {
  cookiesRemoved: 'куки удалены',
  noSavedFilms: 'У Вас нет сохраненных фильмов',
  routNotFound: 'Путь не найден',
};
