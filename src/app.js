const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy, localStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const session = require("express-session");
const mysqlstore = require("express-mysql-session")(session);


const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors({
  origin: true, // 출처 허용 옵션
  credential: true // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
}));
// app.options('*', cors());

const option = config.session;

// express session 설정
app.use(session({
  secret: config.jwt.secret, // 세션을 암호화 해줌
  name: "authentication", // 쿠키 이름 설정
  resave: false, // 세션을 항상 저장할지 여부를 정하는 값(false 권장)
  saveUninitialized: true, // 초기화 되지 않은 채 스토어에 저장되는 세션
  store: new mysqlstore(option),
}));

const passportConfig = require('./config/passport.index');
passportConfig();
// jwt authentication
app.use(passport.initialize());
app.use(passport.session())

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

// handle success


module.exports = app;
