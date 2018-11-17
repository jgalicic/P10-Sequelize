"use strict";
module.exports = (sequelize, DataTypes) => {
  var Loan = sequelize.define(
    "Loan",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      book_id: {
        type: DataTypes.INTEGER,
        validate: { notEmpty: { msg: "Book is required" } }
      },
      patron_id: {
        type: DataTypes.INTEGER,
        validate: { notEmpty: { msg: "Patron is required" } }
      },
      loaned_on: {
        type: DataTypes.DATEONLY,
        validate: { notEmpty: { msg: "Loaned on date is required" } }
      },
      return_by: {
        type: DataTypes.DATEONLY,
        validate: { notEmpty: { msg: "Return by date is required" } }
      },
      returned_on: {
        type: DataTypes.DATEONLY
      }
    },
    { timestamps: false, underscored: true }
  );
  Loan.associate = function(models) {
    models.Loan.belongsTo(models.Book);
    models.Loan.belongsTo(models.Patron);
  };
  return Loan;
};
