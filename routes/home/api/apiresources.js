const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

const getMetaData = require("./metadata");

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

const createNewResource = (values, userID, metadata) => {
  const queryString = `
    INSERT INTO resources
      (user_id, title, link, description, date_created, url_title, url_author, url_description, cover_photo_url)
    VALUES
      ($1, $2, $3, $4, CURRENT_DATE, $5, $6, $7, $8)
    RETURNING id;
    `;
  const returnValues = [
    userID,
    values.title,
    values.link,
    values.description,
    metadata.title,
    metadata.author,
    metadata.description,
    metadata.image
  ];
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

const createNewResourceJoinCategory = (
  body,
  userID,
  categoryID,
  scrapeData,
  db
) => {
  // returns new resource ID
  const queryString3 = createNewResource(body, userID, scrapeData);
  db.query(queryString3[0], queryString3[1]).then(data => {
    // join the category to the resource in the category_resource table
    const queryString4 = joinResourceCategory(data.rows[0].id, categoryID);
    db.query(queryString4[0], queryString4[1]);
  });
};

const getUserResources = userID => {
  const queryString = `
    SELECT resources.*, users.name FROM resources
    JOIN users ON resources.user_id=users.id
    WHERE user_id = $1
    `;
  const values = [userID];
  return [queryString, values];
};

const saveResource = (db, userID, resourceID) => {
  const queryString = `
    INSERT INTO comments (user_id, resource_id, add_to_my_resources, date_created)
    VALUES ($1, $2, TRUE, CURRENT_DATE)
    `;
  const values = [userID, resourceID];
  db.query(queryString, values);
};

const getLikedResources = userID => {
  const queryString = `
  SELECT DISTINCT comments.resource_id as id, users.name, comments.add_to_my_resources, comments.upvote, comments.downvote, resources.* from resources
  JOIN comments ON resources.id = resource_id
  JOIN users ON resources.user_id = users.id
  WHERE comments.user_id = $1 AND add_to_my_resources = TRUE
  GROUP BY resources.id, comments.resource_id, users.name, comments.add_to_my_resources, comments.upvote, comments.downvote;`;
  const values = [userID];
  return [queryString, values];
};

const voteQuery = (userID, resourceID) => {
  const queryString = `
    SELECT upvote, downvote FROM comments
    WHERE user_id=$1
    AND resource_id=$2
  `;
  const values = [userID, resourceID];
  return [queryString, values];
};

const voteResource = (db, userID, resourceID, vote) => {
  const queryString1 = voteQuery(userID, resourceID);
  return db.query(queryString1[0], queryString1[1]).then(data => {
    if (data.rows[0] !== undefined) {
      let oppositeVote = "";
      if (vote === "upvote") {
        oppositeVote = "downvote";
      } else {
        oppositeVote = "upvote";
      }
      const queryString = `
        UPDATE comments
        SET ${vote}=true,
            ${oppositeVote}=false
        WHERE user_id=$1
        AND resource_id=$2;
      `;
      const values = [userID, resourceID];
      return db.query(queryString, values);
    } else {
      const queryString = `
        INSERT INTO comments
          (user_id, resource_id, ${vote}, date_created)
        VALUES
          ($1, $2, true, NOW());
        `;
      const values = [userID, resourceID];
      return db.query(queryString, values).then(() => {
        return true;
      });
    }
  });
};

const getResources = () => {
  const queryString = `
  SELECT resources.*, users.name FROM resources JOIN users ON
  resources.user_id=users.id
  ORDER BY resources.id
  LIMIT 30;
  `;
  return queryString;
};

const getCommentsByUser = userID => {
  const queryString = `
  SELECT *
  FROM comments
  WHERE user_id=$1
  `;
  const values = [userID];
  return [queryString, values];
};

const getAllComments = () => {
  const queryString = `
  SELECT *
  FROM comments
  `;
  return queryString;
};

const returnResourcesWithVotes = (db, userID) => {
  if (!userID) {
    // select first ten resources
    // returns the rows of the query
    // send data into templatevars then render
    const queryString1 = getResources();
    return db
      .query(queryString1)
      .then(data => {
        let resources = data.rows;

        const queryString2 = getAllComments();
        return db.query(queryString2).then(data => {
          for (const resource of resources) {
            resource.upvote = false;
            resource.downvote = false;
            resource.add_to_my_resources = false;
            let totalUpvotes = 0;
            let totalDownvotes = 0;
            for (const comment of data.rows) {
              if (comment.resource_id === resource.id) {
                if (comment.upvote) {
                  totalUpvotes++;
                }
                if (comment.downvote) {
                  totalDownvotes++;
                }
              }
            }
            resource.total_upvotes = totalUpvotes;
            resource.total_downvotes = totalDownvotes;
            resource.net_votes = totalUpvotes - totalDownvotes;
          }
          return resources;
        });
      })
      .catch(err => console.log(err));
  } else {
    // select first ten resources and whether user has liked or not
    const queryString1 = getResources();

    // returns the rows of the query
    // send data into templatevars then render
    return db
      .query(queryString1)
      .then(data => {
        const resources = data.rows;
        const queryString2 = getCommentsByUser(userID);
        return db.query(queryString2[0], queryString2[1]).then(data => {
          const comments = data.rows;
          for (const resource of resources) {
            resource.upvote = false;
            resource.downvote = false;
            resource.add_to_my_resources = false;
            for (const comment of comments) {
              if (resource.id === comment.resource_id) {
                resource.upvote = comment.upvote;
                resource.downvote = comment.downvote;
                resource.add_to_my_resources = comment.add_to_my_resources;
              }
            }
          }
          // return resources;
          const queryString3 = getAllComments();
          return db.query(queryString3).then(data => {
            for (const resource of resources) {
              let totalUpvotes = 0;
              let totalDownvotes = 0;
              for (const comment of data.rows) {
                if (comment.resource_id === resource.id) {
                  if (comment.upvote) {
                    totalUpvotes++;
                  }
                  if (comment.downvote) {
                    totalDownvotes++;
                  }
                }
              }
              resource.total_upvotes = totalUpvotes;
              resource.total_downvotes = totalDownvotes;
              resource.net_votes = totalUpvotes - totalDownvotes;
            }
            return resources;
          });
        });
      })
      .catch(err => console.log(err));
  }
};

module.exports = db => {
  router.post("/input", async (req, res) => {
    const userID = req.session.user_id;
    const scrapeData = await getMetaData(req.body.link);
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

          createNewResourceJoinCategory(
            req.body,
            userID,
            categoryID,
            scrapeData,
            db
          );
        });
      } else {
        // Save the new category ID for joining with resource
        const categoryID = data.rows[0].id;

        createNewResourceJoinCategory(
          req.body,
          userID,
          categoryID,
          scrapeData,
          db
        );
      }
    });
    res.redirect("/");
  });

  router.get("/my_resources", (req, res) => {
    const userID = req.session.user_id;
    // get resources that the user has uploaded
    const queryString1 = getUserResources(userID);
    db.query(queryString1[0], queryString1[1]).then(data => {
      let resources = data.rows;
      const queryString3 = getAllComments();
      db.query(queryString3).then(data => {
        for (const resource of resources) {
          let totalUpvotes = 0;
          let totalDownvotes = 0;
          for (const comment of data.rows) {
            if (comment.resource_id === resource.id) {
              if (comment.upvote) {
                totalUpvotes++;
              }
              if (comment.downvote) {
                totalDownvotes++;
              }
            }
          }
          resource.total_upvotes = totalUpvotes;
          resource.total_downvotes = totalDownvotes;
          resource.net_votes = totalUpvotes - totalDownvotes;
        }
        res.json(resources);
      });
    });
  });

  router.get("/my_liked_resources", (req, res) => {
    const userID = req.session.user_id;
    const queryString1 = getLikedResources(userID);
    db.query(queryString1[0], queryString1[1]).then(data => {
      let resources = data.rows;
      const queryString3 = getAllComments();
      db.query(queryString3).then(data => {
        for (const resource of resources) {
          let totalUpvotes = 0;
          let totalDownvotes = 0;
          for (const comment of data.rows) {
            if (comment.resource_id === resource.id) {
              if (comment.upvote) {
                totalUpvotes++;
              }
              if (comment.downvote) {
                totalDownvotes++;
              }
            }
          }
          resource.total_upvotes = totalUpvotes;
          resource.total_downvotes = totalDownvotes;
          resource.net_votes = totalUpvotes - totalDownvotes;
        }
        res.json(resources);
      });
    });
  });
  //Remove saved post (unsave a post)
  router.delete("/my_liked_resources/:id", async (req, res) => {
    const resourceID = req.params.id;
    const userID = req.session.user_id;
    const queryString = `
    DELETE FROM comments
    WHERE user_id = $1 AND resource_id = $2;`;
    const values = [userID, resourceID];
    db.query(queryString, values).then(res.redirect("/my_resources"));
  });

  router.post("/my_liked_resources/:id", async (req, res) => {
    const resourceID = req.params.id;
    const userID = req.session.user_id;
    const isValid = await saveResource(db, userID, resourceID);
    if (isValid) {
      res.sendStatus(201);
    } else {
      res.sendStatus(408);
    }
  });

  router.post("/upvote/:id", async (req, res) => {
    console.log("upvoting");
    const resourceID = parseInt(req.params.id);
    const userID = req.session.user_id;
    const isValidVote = await voteResource(db, userID, resourceID, "upvote");
    if (isValidVote) {
      res.sendStatus(201);
    } else {
      res.sendStatus(404);
    }
  });

  router.post("/downvote/:id", async (req, res) => {
    console.log("downvoting");
    const resourceID = parseInt(req.params.id);
    const userID = req.session.user_id;
    const isValidVote = await voteResource(db, userID, resourceID, "downvote");
    if (isValidVote) {
      res.sendStatus(201);
    } else {
      res.sendStatus(404);
    }
  });

  router.get("/c/:resourceid", (req, res) => {
    let queryString = `
      SELECT comments.comment as comment, users.name as user_name FROM comments JOIN users ON
      users.id=user_id
      WHERE resource_id=$1 and comment IS NOT NULL
      `;
    let values = [req.params.resourceid];

    //returns the rows of the query
    //send data into templatevars then render

    db.query(queryString, values)
      .then(data => res.json(data.rows))
      .catch(err => console.log(err));
  });

  //inserts a new comment to a resource
  router.post("/c/:resourceid", (req, res) => {
    //if a comment doesn't exist already
    let queryString = `
      INSERT INTO comments (user_id, resource_id, comment, date_created)
      VALUES ($1, $2, $3, CURRENT_DATE)
      `;
    let values = [req.session.user_id, req.params.resourceid, req.body.comment];

    db.query(queryString, values).catch(err => console.log(err));
  });

  router.get("/categories", (req, res) => {
    //const category = req.params.category.toLowerCase();
    //make query to show resources based on category
    // let queryString = `
    //   SELECT resources.*, users.id as user_resource_upload, users.name FROM resources JOIN users ON
    //   resources.user_id=users.id
    //   LIMIT 20;
    //   `;

    let queryString = `
      SELECT * FROM categories
      LIMIT 20;
      `;
    //let values = [`%${category}%`];

    //returns the rows of the query
    //send data into templatevars then render

    db.query(queryString)
      .then(data => res.json(data.rows))
      .catch(err => console.log(err));
  });

  router.get("/", async (req, res) => {
    // make query to show resources based on category
    // if user is signed in, also send upvote, downvote and add_to_resources
    let userID = false;
    if (req.session.user_id !== undefined) {
      userID = req.session.user_id;
    }
    const resources = await returnResourcesWithVotes(db, userID);
    res.json(resources);
  });

  return router;
};

//grabbing metadata
