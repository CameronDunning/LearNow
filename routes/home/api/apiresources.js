const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

// Functions
// New Resource Functions

const categoriesThatAlreadyExist = category => {
  const queryString = `
    SELECT id
    FROM categories
    WHERE name = $1
    `;
  return [queryString, [category]];
};

const createNewCategory = category => {
  const queryString = `
    INSERT INTO categories
      (name)
    VALUES
      ($1)
    RETURNING id;
    `;
  return [queryString, [category]];
};

const createNewResource = (values, userID) => {
  const queryString = `
    INSERT INTO resources
      (user_id, title, link, description, date_created)
    VALUES
      ($1, $2, $3, $4, Now())
    RETURNING id;
    `;
  const returnValues = [userID, values.title, values.link, values.description];
  console.log(returnValues);
  return [queryString, returnValues];
};

const joinResourceCategory = (resourceID, categoryID) => {
  const queryString = `
    INSERT INTO category_resource
      (resource_id, category_id)
    VALUES
      ($1, $2);
    `;
  const values = [resourceID, categoryID];
  return [queryString, values];
};

const createNewResourceJoinCategory = (body, userID, categoryID, db) => {
  // returns new resource ID
  const queryString3 = createNewResource(body, userID);
  db.query(queryString3[0], queryString3[1]).then(data => {
    // join the category to the resource in the category_resource table
    const queryString4 = joinResourceCategory(data.rows[0].id, categoryID);
    db.query(queryString4[0], queryString4[1]);
  });
};

const upvoteQuery = (userID, resourceID) => {
  const queryString = `
    SELECT upvote FROM comments
    WHERE user_id=$1
    AND resource_id=$2
  `;
  const values = [userID, resourceID];
  return [queryString, values];
};

const upvoteResource = (db, userID, resourceID) => {
  const queryString1 = upvoteQuery(userID, resourceID);
  return db.query(queryString1[0], queryString1[1]).then(data => {
    if (data.rows[0] !== undefined) {
      return false;
    } else {
      const queryString = `
        INSERT INTO comments
          (user_id, resource_id, upvote, date_created)
        VALUES
          ($1, $2, true, NOW())
        `;
      const values = [userID, resourceID];
      return db.query(queryString, values).then(() => {
        return true;
      });
    }
  });
};

module.exports = db => {
  router.post("/input", (req, res) => {
    console.log(req.body);
    console.log(req.session.user_id);
    const userID = req.session.user_id;
    // make query to show resources based on category
    // returns an OBJECT of all the categories that already exist
    const queryString1 = categoriesThatAlreadyExist(req.body.category);
    db.query(queryString1[0], queryString1[1]).then(data => {
      // create a new category if it doesn't exist
      // add new resource to the database and link it to the category
      if (data.rows[0] == undefined) {
        // return new category ID
        const queryString2 = createNewCategory(req.body.category);

        db.query(queryString2[0], queryString2[1]).then(data => {
          // Save the new category ID for joining with resource
          const categoryID = data.rows[0].id;

          createNewResourceJoinCategory(req.body, userID, categoryID, db);
        });
      } else {
        // Save the new category ID for joining with resource
        const categoryID = data.rows[0].id;

        createNewResourceJoinCategory(req.body, userID, categoryID, db);
      }
    });
  });

  router.post("/upvote/:id", async (req, res) => {
    const resourceID = req.params.id;
    const userID = req.session.user_id;
    const isValidVote = await upvoteResource(db, userID, resourceID);
    if (isValidVote) {
      res.sendStatus(201);
    } else {
      res.sendStatus(404);
    }
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
