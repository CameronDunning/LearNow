const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

module.exports = db => {
  //goes to user profile page
  router.get("/:user/", (req, res) => {
    let user = req.params.user;
    templateVars = {
      userid: user
    };
    res.render("update_profile", templateVars);
  });

  //edits users stuff
  router.put("/:user", (req, res) => {
    const { name, password } = req.body;
    console.log("inside put req");
    let updateQuery = `
    UPDATE users
    SET
      name = $1,
      password = $2
    WHERE id=$3;`;

    const hashedPassword = bcrypt.hashSync(password, 10);
    updateValues = [name, hashedPassword, req.params.user];
    db.query(updateQuery, updateValues).then(res.redirect("/"));
  });

  //shows user's resources
  router.get(":user/:category", (req, res) => {
    // res.render("user");
  });

  return router;
};
