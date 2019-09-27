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

module.exports = db => {
  //Get and post requests for the login page
  router.get("/login", (req, res) => {
    if (req.session.user_id) {
      return res.redirect("/");
    }
    let templateVars = {};
    templateVars.user_id = req.session.user_id ? req.session.user_id : "";
    templateVars.wrongLogin = req.session.wrongLogin;
    res.render("login", templateVars);
  });

  //Info from login gets sent here,
  router.post("/login", (req, res) => {
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
          console.log(user.id, user.email);
          req.session.user_id = user.id;
          req.session.user_email = user.email;
          req.session.user_name = user.name;
          // req.session.user_first_letter = user.first_letter;
          return res.redirect("/");
        }
      })
      .catch(err => {
        req.session.wrongLogin = true;
        res.redirect("/login");
      });
  });

  //Get and post requests for the register page
  router.get("/register", (req, res) => {
    let templateVars = {};
    templateVars.user_id = "";
    templateVars.alreadyExists = req.session.already_exists
      ? req.session.already_exists
      : "";
    res.render("register", templateVars);
  });
  //registration post
  router.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    //if either parameter is empty, set cookie to equal blank so that .ejs file will present the text
    if (email === "" || password === "") {
      req.session.emailExists = "blank";
      return res.redirect("/register");
    }
    let queryString = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id
    `;
    values = [name, email, hashedPassword];
    db.query(queryString, values)
      .then(data => {
        console.log(data);
        req.session.user_email = email;
        req.session.user_name = name;
        req.session.user_id = data.rows[0].id;
        if (data.error) {
          return res.redirect("/register");
        } else {
          res.redirect("/");
        }
      })
      .catch(err => {
        req.session.already_exists = "alreadyExists";
        return res.redirect("/register");
      });
  });

  router.get("/my_resources", (req, res) => {
    templateVars = {
      user_id: req.session.user_id,
      user_name: req.session.user_name
    };
    res.render("my_resources", templateVars);
  });

  //logout
  router.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
  });

  //Get and post requests for the update profile page
  router.get("/update", (req, res) => {
    let templateVars = {};
    templateVars.user_id = req.session.user_id;
    res.render("update_profile"), templateVars;
  });
  //Get and post requests for the update profile page

  //get request for the home page
  router.get("/", (req, res) => {
    if (!req.session.user_id) {
      res.redirect("/login");
    } else {
      const templateVars = {
        user_id: req.session.user_id ? req.session.user_id : "",
        user_name: req.session.user_name ? req.session.user_name : ""
      };
      res.render("home", templateVars);
    }
  });

  return router;
};
