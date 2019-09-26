const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

module.exports = db => {
  //goes to user profile page
  router.get("/:user/", (req, res) => {
    let user = req.params.user;
    console.log("user_id: ", req.session.user_id);
    const templateVars = {
      userid: user,
      user_id: req.session.user_id,
      user_name: req.session.user_name
    };
    res.render("update_profile", templateVars);
  });

  //edits users stuff
  router.put("/:user", (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
      res.redirect("/u/" + req.params.user);
    }
    console.log1("inside put req");
    let updateQuery = `
    UPDATE users
    SET
      name = $1,
      password = $2
    WHERE id=$3;`;
    req.session.user_name = name;
    let templateVars = {
      user_name: name,
      user_id: req.session.user_id
    };

    console.log(templateVars);
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
