var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const { connectToMongoDb } = require("./conf/db.js");
const cors = require("cors");
require("dotenv").config();

const http = require("http");

var indexRouter = require("./routes/indexRouter");
var usersRouter = require("./routes/usersRouter.js");
var osRouter = require("./routes/osRouter");
var AbonnementRouter = require("./routes/AbonnementRouter");
var ActiviteRouter = require("./routes/ActiviteRouter");
var SeanceRouter = require("./routes/SeanceRouter.js");
var SalleRouter = require("./routes/SalleRouter.js");
const factureRouter = require("./routes/factureRouter.js");
const notificationRouter = require("./routes/NotificationRouter.js");
const avisRouter = require("./routes/AvisRouter.js");
const reservationRouter = require("./routes/ReservationRouter.js");
const promotionRouter = require("./routes/PromotionRouter.js");
const inscrireRouter = require("./routes/InscrireRouter.js");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
//app.use("/uploads", express.static("uploads"));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.1.34:3000",
      "http://192.168.1.34:5000",
      "http://127.0.0.1:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
    optionsSuccessStatus: 200,
  })
);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.get("Origin")}`);
  if (req.method === "OPTIONS") {
    console.log("Requête OPTIONS (CORS preflight)");
  }
  if (req.method === "POST" && req.path.includes("reset-password")) {
    console.log("Reset password request body:", req.body);
  }
  next();
});

app.use(
  session({
    secret: "net secret pfe",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/os", osRouter);
app.use("/Abonnement", AbonnementRouter);
app.use("/Facture", factureRouter);
app.use("/Activite", ActiviteRouter);
app.use("/Seance", SeanceRouter);
app.use("/salle", SalleRouter);
app.use("/notification", notificationRouter);
app.use("/avis", avisRouter);
app.use("/reservation", reservationRouter);
app.use("/promotion", promotionRouter);
app.use("/inscrire", inscrireRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

const server = http.createServer(app);
server.listen(process.env.port || 5000, "0.0.0.0", () => {
  connectToMongoDb();
  console.log(`Serveur en cours d'exécution sur http://0.0.0.0:${process.env.port || 5000}`);
});

module.exports = app;