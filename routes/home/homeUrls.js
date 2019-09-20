const express = require("express");
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

//import EJS files here login/register/home

/**
 * Get/post: login page
 * get/post: register
 * Get/Post: Create new resource
 * Get/Post: update profile
 * Get/post: comment on resource
 * Get     : my resources
 *  */

//Get and post requests for the login page
router.get("login", (req, res) => {
  res.render("login", templateVars);
});
router.post("login", (req, res) => {
  //login authentification *maybe fake first for mvp*
});

//Get and post requests for the register page
router.get("register", (req, res) => {
  res.render("register", templateVars);
});
router.post("register", (req, res) => {
  //register
  //req.body.___
});

//get request for the home page
router.get("/", (req, res) => {
  res.render("showresources", templateVars);
});
