//importing requirements
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const express = require("express");
const app = express();

const homeUrls = require("./routes/home/homeUrls");
const userUrls = require("./routes/home/users/userUrls");
const resourceUrls = require("./routes/home/resources/resourceUrls");

const PORT = process.env.PORT || 8080;

//routes
app.use("/", homeUrls);
app.use("/u/", userUrls);
app.use("/r/", resourceUrls);

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
  console.log(`LearNow app listening on port ${PORT}!`);
});
