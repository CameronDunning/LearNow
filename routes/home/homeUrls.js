const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

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
    WHERE name=$1; 
    `;
    values = [req.body.email];
    db.query(queryString, values)
      .then(data => data.rows)
      .then(user => {
        console.log(req.body.password);
        if (bcrypt.compareSync(req.body.password, user.password)) {
          console.log("user found and password correct");
          req.session.user_id = user.id;
          req.session.user_email = user.email;
          req.session.user_first_letter = user.first_letter;
          return res.redirect("/");
        } else {
          req.session.wrongLogin = true;
          res.redirect("/login");
        }
      })
      .catch(err => res.status(404).json(err));
  });

  //Get and post requests for the register page
  router.get("/register", (req, res) => {
    res.render("register");
  });

  //get request for the home page
  router.get("/", (req, res) => {
    res.render("home");
    //res.render("showresources", templateVars);
  });

  return router;
};
