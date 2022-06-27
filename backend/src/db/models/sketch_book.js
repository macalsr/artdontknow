const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const sketch_book = sequelize.define(
    'sketch_book',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      sketches: {
        type: DataTypes.TEXT,
      },

      createdDate: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  sketch_book.associate = (db) => {
    db.sketch_book.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.sketch_book.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return sketch_book;
};
