"use strict";
module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define(
    "Book",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      title: {
        type: DataTypes.STRING,
        validate: { notEmpty: { msg: "Title is required" } }
      },
      author: {
        type: DataTypes.STRING,
        validate: { notEmpty: { msg: "Author is required" } }
      },
      genre: {
        type: DataTypes.STRING,
        validate: { notEmpty: { msg: "Genre is required" } }
      },
      first_published: {
        type: DataTypes.INTEGER
      }
    },
    { timestamps: false, underscored: true }
  );
  Book.associate = function(models) {
    models.Book.hasMany(models.Loan);
  };
  return Book;
};
