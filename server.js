//importing requirements
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const express = require("express");
const app = express();

const homeurls = require("./routes/home/homeurls");

const PORT = process.env.PORT || 8080;

//routes
app.use("/", homeurls);

//middleware
app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: "Session",
    keys: [0]
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
