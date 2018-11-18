const express = require("express");
const router = express.Router();
const db = require("../models/index.js");
const Op = db.sequelize.Op;

/* GET All Patrons */
router.get("/", function(req, res, next) {
  db.Patron.findAll({ order: [["last_name", "ASC"]] }).then(patrons => {
    res.render("patrons/all_patrons", {
      patrons: patrons,
      title: "Library Manager"
    });
  });
});

/* GET New Patron */
router.get("/new", function(req, res, next) {
  res.render("patrons/new_patron", {
    patron: db.Patron.build(),
    title: "New Patron"
  });
});

/* POST New Patron */
router.post("/new", (req, res, next) => {
  db.Patron.create(req.body)
    .then(() => res.redirect("/patrons/"))
    .catch(err => {
      if (err.name === "SequelizeValidationError") {
        res.render("patrons/new_patron", {
          patron: req.body,
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(err => {
      res.send(500);
    });
});

/* GET Patron Detail */
router.get("/:id", function(req, res, next) {
  db.Patron.findOne({
    include: [
      {
        model: db.Loan,
        include: [
          {
            model: db.Book
          }
        ]
      }
    ],
    where: {
      id: {
        [Op.eq]: req.params.id
      }
    }
  }).then(function(patron) {
    res.render("patrons/patron_detail", { patron });
  });
});

/* POST (Update) Patron Detail */
router.post("/:id", (req, res, next) => {
  db.Patron.findOne({
    include: [
      {
        model: db.Loan,
        include: [
          {
            model: db.Book
          }
        ]
      }
    ],
    where: {
      id: {
        [Op.eq]: req.params.id
      }
    }
  })
    .then(patron => {
      return patron.update(req.body);
    })
    .then(() => {
      res.redirect("/patrons");
    })
    .catch(err => {
      if (err.name === "SequelizeValidationError") {
        db.Patron.findOne({
          include: [
            {
              model: db.Loan,
              include: [
                {
                  model: db.Book
                }
              ]
            }
          ],
          where: {
            id: {
              [Op.eq]: req.params.id
            }
          }
        }).then(patron => {
          res.render(`patrons/patron_detail`, {
            patron: patron,
            errors: err.errors
          });
        });
      } else {
        throw err;
      }
    })
    .catch(err => {
      res.send(500);
    });
});

module.exports = router;
