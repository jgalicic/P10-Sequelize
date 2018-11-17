const express = require("express");
const router = express.Router();

/* GET home screen */
router.get("/", function(req, res, next) {
  res.render("home", { title: "Library Manager" });
});

module.exports = router;
