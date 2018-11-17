"use strict";
module.exports = (sequelize, DataTypes) => {
  var Patron = sequelize.define(
    "Patron",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      first_name: {
        type: DataTypes.STRING,
        validate: { notEmpty: { msg: "First name is required" } }
      },
      last_name: {
        type: DataTypes.STRING,
        validate: { notEmpty: { msg: "Last name is required" } }
      },
      address: {
        type: DataTypes.STRING,
        validate: { notEmpty: { msg: "Address is required" } }
      },
      email: {
        type: DataTypes.STRING,
        validate: { isEmail: { msg: "Please enter a valid email address" } }
      },
      library_id: {
        type: DataTypes.STRING,
        validate: { notEmpty: { msg: "Library ID is required" } }
      },
      zip_code: {
        type: DataTypes.INTEGER,
        validate: { isNumeric: { msg: "Zip Code is required" } }
      }
    },
    { timestamps: false, underscored: true }
  );
  Patron.associate = function(models) {
    models.Patron.hasMany(models.Loan);
  };
  return Patron;
};
