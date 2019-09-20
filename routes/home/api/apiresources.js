const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get("/:category", (req, res) => {
    const category = req.params.category.toLowerCase();
    //make query to show resources based on category
    let queryString = `
      SELECT * FROM resources
      WHERE tag LIKE $1
      LIMIT 10;
      `;
    let values = [`%${category}%`];

    //returns the rows of the query
    //send data into templatevars then render

    db.query(queryString, values)
      .then(data => res.json(data.rows))
      .catch(err => console.log(err));
  });

  router.get("/", (req, res) => {
    //make query to show resources based on category
    let queryString = `
      SELECT * FROM resources
      LIMIT 10;
      `;

    //returns the rows of the query
    //send data into templatevars then render
    db.query(queryString)
      .then(data => res.json(data.rows))
      .catch(err => console.log(err));
  });

  return router;
};
