const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get("/:category", (req, res) => {
    const category = req.params.category;
    //make query to show resources based on category
    let queryString = `
  SELECT * FROM resource
  WHERE tag LIKE '$1'
  `;
    let values = [`%${category}%`];

    //returns the rows of the query
    //send data into templatevars then render

    db.query(queryString, values)
      .then(res => res.rows)
      //todo
      .then(res.render("category", templateVars))
      .catch(err => console.log(err));
  });

  return router;
};
