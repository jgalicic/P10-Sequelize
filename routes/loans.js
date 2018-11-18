const express = require("express");
const router = express.Router();
const db = require("../models/index.js");
const Op = db.sequelize.Op;
const moment = require("moment");

let currentDate = moment().format("YYYY[-]MM[-]DD");
let returnByDate = moment()
  .add(7, "days")
  .format("YYYY[-]MM[-]DD");

/* GET All Loans */
router.get("/", function(req, res, next) {
  db.Loan.findAll({
    include: [{ model: db.Book }, { model: db.Patron }]
  }).then(function(loans) {
    res.render("loans/all_loans", { loans });
  });
});

/* GET New Loan */
router.get("/new", function(req, res, next) {
  db.Book.findAll({
    include: [
      {
        model: db.Loan
      }
    ]
  }).then(books => {
    db.Patron.findAll().then(patrons => {
      patrons.currentDate = currentDate;
      patrons.returnByDate = returnByDate;
      res.render("loans/new_loan", { books, patrons });
    });
  });
});

/* POST New Loan */
router.post("/new", (req, res, next) => {
  db.Loan.create(req.body)
    .then(() => res.redirect("/loans"))
    .catch(err => {
      if (err.name === "SequelizeValidationError") {
        db.Book.findAll({
          include: [
            {
              model: db.Loan
            }
          ]
        }).then(books => {
          db.Patron.findAll().then(patrons => {
            patrons.currentDate = currentDate;
            patrons.returnByDate = returnByDate;
            res.render("loans/new_loan", {
              books: books,
              patrons: patrons,
              errors: err.errors
            });
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

/* GET Overdue Loans */
router.get("/overdue", (req, res, next) => {
  db.Loan.findAll({
    where: {
      returned_on: null,
      return_by: {
        [Op.lt]: new Date()
      }
    },
    include: [{ model: db.Book }, { model: db.Patron }]
  }).then(loans => {
    res.render("loans/overdue_loans", { loans });
  });
});

/* GET Checked Out Loans */
router.get("/checked", (req, res, next) => {
  db.Loan.findAll({
    where: {
      returned_on: null,
      return_by: {
        // check if a return_by value exists
        [Op.not]: null
      }
    },
    include: [{ model: db.Book }, { model: db.Patron }]
  }).then(loans => {
    res.render("loans/checked_loans", { loans });
  });
});

module.exports = router;
