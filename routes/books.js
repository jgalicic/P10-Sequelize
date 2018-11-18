const express = require("express");
const router = express.Router();
const db = require("../models/index.js");
const Op = db.sequelize.Op;
const moment = require("moment");

let currentDate = moment().format("YYYY[-]MM[-]DD");

/* GET All Books */
router.get("/", function(req, res, next) {
  db.Book.findAll({ order: [["first_published", "DESC"]] }).then(books => {
    console.log(currentDate);
    res.render("books/all_books", {
      books,
      currentDate
    });
  });
});

/* GET New Book form */
router.get("/new", function(req, res, next) {
  res.render("books/new_book", { book: db.Book.build() });
});

/* GET Checked Out Books */
router.get("/checked_books", (req, res, next) => {
  db.Book.findAll({
    include: [
      {
        model: db.Loan,
        where: {
          returned_on: null,
          return_by: {
            // check if a return_by value exists
            [Op.not]: null
          }
        }
      }
    ]
  }).then(books => {
    if (books) {
      res.render("books/checked_books", { books });
    } else {
      res.send(404);
    }
  });
});

/* GET Return Book. */
router.get("/return/:id", function(req, res, next) {
  db.Book.findOne({
    include: [
      {
        model: db.Loan,
        include: [
          {
            model: db.Patron
          }
        ]
      }
    ],
    where: {
      id: {
        [Op.eq]: req.params.id
      }
    }
  }).then(function(books) {
    if (books) {
      books.currentDate = currentDate;
      res.render("books/return_book", { books });
    } else {
      res.send(404);
    }
  });
});

/* GET Overdue Books */
router.get("/overdue_books", (req, res, next) => {
  db.Book.findAll({
    include: [
      {
        model: db.Loan,
        where: {
          returned_on: null,
          return_by: {
            [Op.lt]: new Date()
          }
        }
      }
    ]
  }).then(books => {
    if (books) {
      res.render("books/overdue_books", { books });
    } else {
      res.send(404);
    }
  });
});

/* POST New Book */
router.post("/new", (req, res, next) => {
  db.Book.create(req.body)
    .then(() => res.redirect("/books/"))
    .catch(err => {
      if (err.name === "SequelizeValidationError") {
        res.render("books/new_book", {
          book: req.body,
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

/* POST Return Book */
router.post("/return/:id", (req, res, next) => {
  db.Book.findOne({
    include: [
      {
        model: db.Loan,
        include: [
          {
            model: db.Patron
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
    .then(book => {
      return book.Loans[0].update(req.body);
    })
    .then(() => {
      res.redirect("/loans/");
    })
    .catch(err => {
      if (err.name === "SequelizeValidationError") {
        console.log("ERROR!");
        db.Book.findOne({
          include: [
            {
              model: db.Loan,
              include: [
                {
                  model: db.Patron
                }
              ]
            }
          ],
          where: {
            id: {
              [Op.eq]: req.params.id
            }
          }
        }).then(books => {
          res.render(`books/return_book`, {
            books: books,
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

/* GET Individual Book Detail */
router.get("/:id", function(req, res, next) {
  db.Book.findOne({
    include: [
      {
        model: db.Loan,
        include: [
          {
            model: db.Patron
          }
        ]
      }
    ],
    where: {
      id: {
        [Op.eq]: req.params.id
      }
    }
  }).then(function(book) {
    res.render("books/book_detail", { book });
  });
});

/* POST (Update) Individual Book Detail */
router.post("/:id", function(req, res, next) {
  db.Book.findOne({
    include: [
      {
        model: db.Loan,
        include: [
          {
            model: db.Patron
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
    .then(book => {
      return book.update(req.body);
    })
    .then(() => {
      res.redirect("/books");
    })
    .catch(err => {
      if (err.name === "SequelizeValidationError") {
        db.Book.findOne({
          include: [
            {
              model: db.Loan,
              include: [
                {
                  model: db.Patron
                }
              ]
            }
          ],
          where: {
            id: {
              [Op.eq]: req.params.id
            }
          }
        }).then(book => {
          res.render(`books/book_detail`, {
            book: book,
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
