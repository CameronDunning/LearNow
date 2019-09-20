const express = require("express");
const router = express.Router();

module.exports = db => {
  //goes to user profile page
  router.get(":user/", (req, res) => {
    let user = req.params.user;
    res.render("user");
  });

  //edits users stuff
  router.put(":user/", (req, res) => {
    res.render("user");
  });

  //shows user's resources
  router.get(":user/:category", (req, res) => {
    // res.render("user");
  });

  return router;
};
