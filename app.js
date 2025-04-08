var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const{connectToMongoDb } = require("./conf/db.js");

require("dotenv").config();


const http = require("http");

var indexRouter = require('./routes/indexRouter');
var usersRouter = require('./routes/usersRouter.js');
var osRouter = require('./routes/osRouter');
var AbonnementRouter = require('./routes/AbonnementRouter');
var ProgrammeRouter = require("./routes/ProgrammeRouter");
var SeanceRouter = require("./routes/SeanceRouter.js");
var SalleRouter = require("./routes/SalleRouter.js");
const factureRouter = require('./routes/factureRouter.js');
const notificationRouter = require('./routes/NotificationRouter.js');
const avisRouter = require('./routes/AvisRouter.js');
const reservationRouter = require('./routes/ReservationRouter.js');
const promotionRouter = require('./routes/PromotionRouter.js');
const inscrireRouter= require('./routes/InscrireRouter.js');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/os', osRouter);
app.use('/Abonnement', AbonnementRouter);
app.use('/Facture', factureRouter);
app.use('/Programme',  ProgrammeRouter);
app.use('/Seance',SeanceRouter);
app.use('/salle',SalleRouter);
app.use('/notification',notificationRouter);
app.use('/avis',avisRouter);
app.use('/reservation',reservationRouter);
app.use('/promotion',promotionRouter);
app.use('/inscrire',inscrireRouter);
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


const server = http.createServer(app);
server.listen(process.env.port, () => {
  connectToMongoDb (),
  console.log("app is running on part 5000");
});