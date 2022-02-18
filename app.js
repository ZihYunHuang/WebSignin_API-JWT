let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let rootRouter = require('./routes/root');
let indexRouter = require('./routes/index');
let loginRouter = require('./routes/login');
let cors = require('cors');
const passport = require('passport');
require('./config/passport')(passport);

// 取得環境變數
require('dotenv').config();

let app = express();

//解決跨網域存取問題
const corsOptions = {
    origin: [
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', rootRouter);
app.use('/api', passport.authenticate('jwt', { session: false }), indexRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(process.env.PORT, () => {
    console.log(`Welcome to Web-Sign app listening at http://${process.env.IP_ADDRESS}:${process.env.PORT}`)
})

module.exports = app;
