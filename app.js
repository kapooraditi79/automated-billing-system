const express = require("express");
const app = express();
const ownerRouter = require("./routes/ownerRouter");
const mainProductRouter = require("./routes/mainProductRouter");
const subProductRouter = require("./routes/subProductRouter");

const cookieParser = require("cookie-parser");
const path = require("path");

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use("/owner", ownerRouter);
app.use("/mainProduct", mainProductRouter);
app.use("/subProduct", subProductRouter);

app.get("/", function (req, res) {
  res.send("Part30");
});

app.listen(3000);
