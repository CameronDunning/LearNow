const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
const cookieSession = require("cookie-session");

router.use(
  cookieSession({
    name: "userId",
    keys: ["id"]
  })
);
//import EJS files here login/register/home

/**
 * Get/post: login page
 * get/post: register
 * Get/Post: Create new resource
 * Get/Post: update profile
 * Get/post: comment on resource
 * Get     : my resources
 *  */

module.exports = db => {
  //Get and post requests for the login page
  router.get("/login", (req, res) => {
    res.render("login");
  });

  //Info from login gets sent here,
  router.post("/login", (req, res) => {
    //! needs testing
    let queryString = `
    SELECT * FROM users
    WHERE email=$1; 
    `;
    values = [req.body.email];
    db.query(queryString, values)
      .then(data => data.rows[0])
      .then(user => {
        console.log(user);
        console.log(req.body.password, user.password);
        if (bcrypt.compareSync(req.body.password, user.password)) {
          console.log("user found and password correct");
          req.session.user_id = user.id;
          req.session.user_email = user.email;
          // req.session.user_first_letter = user.first_letter;
          return res.redirect("/");
        } else {
          req.session.wrongLogin = true;
          res.redirect("/login");
        }
      })
      .catch(err => console.log(err));
  });

  //Get and post requests for the register page
  router.get("/register", (req, res) => {
    res.render("register");
  });
  //registration post
  router.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log(hashedPassword);
    req.session.user_id = name;
    req.session.email = email;

    //if either parameter is empty, set cookie to equal blank so that .ejs file will present the text
    if (email === "" || password === "") {
      req.session.emailExists = "blank";
      return res.redirect("/register");
    }
    let queryString = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    `;
    values = [name, email, hashedPassword];
    db.query(queryString, values)
      .then(res.redirect("/"))
      .catch(err => console.log(err));
  });

  //get request for the home page
  router.get("/", (req, res) => {
    res.render("home");
  });

  return router;
};
