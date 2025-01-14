const express = require("express");
const app = express();
const ownerRouter = require("./routes/ownerRouter");
const mainProductRouter = require("./routes/mainProductRouter");
const subProductRouter = require("./routes/subProductRouter");
const randomModelRouter = require("./routes/randomModelRouter");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const expressSession = require("express-session");
const flash = require("connect-flash");

const cookieParser = require("cookie-parser");
const path = require("path");

require("dotenv").config();
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);

app.set("view engine", "ejs");

app.use(flash());
app.use("/owner", ownerRouter);
app.use("/mainProduct", mainProductRouter);
app.use("/subProduct", subProductRouter);
app.use("/randomModel", randomModelRouter);

app.get("/", function (req, res) {
  res.send("Hello!");
});

app.listen(3000);
