const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
module.exports = db => {
  router.post("/input", (req, res) => {
    //make query to show resources based on category
    let queryString = `
      INSERT INTO resources (id, user_id, title, link, bitly_link, cover_photo_url, description, date_created, total_upvotes, total_downvotes)
      VALUES ($1, $2, $3, ...)
      RETURNING *;
      `;

    values = Object.values(req.body);
    console.log(values);

    //returns the rows of the query
    //send data into templatevars then render
    // db.query(queryString, values)
    //   .then(data => res.json(data.rows))
    //   .catch(err => console.log(err));
  });

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
