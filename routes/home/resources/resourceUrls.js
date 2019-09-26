const express = require("express");
const router = express.Router();

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

const returnResourcesWithVotes = (db, userID, category) => {
  const queryString = `
  SELECT DISTINCT resources.*, users.name, categories.name as category FROM resources JOIN users ON
  resources.user_id=users.id
  JOIN category_resource ON
  category_resource.resource_id=resources.id
  JOIN categories ON
  category_resource.category_id=categories.id
  WHERE categories.name like $1 or resources.title like $1
  ORDER BY resources.id
  LIMIT 10;
  `;
  const values = [`%${category}%`];
  if (!userID) {
    return db
      .query(queryString, values)
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
    // returns the rows of the query
    // send data into templatevars then render
    return db
      .query(queryString, values)
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
  router.get("/:category", async (req, res) => {
    const category = req.params.category;
    let userID = req.session.user_id ? req.session.user_id : false;
    const resources = await returnResourcesWithVotes(db, userID, category);
    res.json(resources);
  });
  return router;
};
