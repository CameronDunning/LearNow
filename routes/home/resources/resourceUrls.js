const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get("/:category", (req, res) => {
    const category = req.params.category;
    //make query to show resources based on category

    res.render("category");
  });

  return router;
};
