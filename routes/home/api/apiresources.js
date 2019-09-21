const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
module.exports = db => {
  router.post("/input", (req, res) => {
    //make query to show resources based on category
    let queryString1 = `
      SELECT id
      FROM categories
      WHERE name = $1
      `;
    let values1 = [req.body.category];
    // returns an OBJECT of all the categories that already exist
    // To be used later
    console.log(req.body);
    console.log(queryString1, values1);
    db.query(queryString1, values1)
      .then(data => {
        console.log(data);
        console.log("categories that don't exist:", data.rows.id);
        if (data.id == undefined) {
          // create new category
          console.log("creating new category");
          let queryString2 = `
          INSERT INTO categories
            (name)
          VALUES
            ($1)
          RETURNING id;
          `;
          let values2 = [req.body.category];
          console.log(queryString2, values2);
          db.query(queryString2, values2);
        }

        // Create new resource
        let queryString3 = `
        INSERT INTO resources
          (user_id, title, link, description, date_created)
        VALUES
          ($1, $2, $3, $4, Now())
        RETURNING
          id;
        `;
        let values3 = [
          req.body.user_id,
          req.body.title,
          req.body.link,
          req.body.description
        ];
        db.query(queryString3, values3).then(data => {
          console.log("resource created");
          console.log("resourceid: ", data.rows.id);
        });
      })
      .then(data => res.json(data.rows))
      .catch(err => console.log(err));
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
