// load .env data into process.env
require("dotenv").config();

//importing requirements
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";

const sass = require("node-sass-middleware");
const morgan = require("morgan");

const homeUrls = require("./routes/home/homeUrls");
const userUrls = require("./routes/home/users/userUrls");
const resourceUrls = require("./routes/home/resources/resourceUrls");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

//routes
app.use("/", homeUrls(db));
app.use("/u/", userUrls(db));
app.use("/r/", resourceUrls(db));

//middleware
app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: "Session",
    keys: [0]
  })
);
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  "/styles",
  sass({
    src: __dirname + "/public/",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded"
  })
);

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`LearNow app listening on port ${PORT}!`);
});
