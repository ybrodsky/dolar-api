'use strict';

const Sequelize = require('sequelize');
const config    = require('config');
const dbConfig  = config.get('dbConfig');

let sequelize   = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
let db          = {};

let History = sequelize.define("History", {
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'oficial',
    index: true
  },
  buy: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  sell: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: () => {
      return new Date();
    }
  }
}, {
  tableName: 'history',
  timestamps: false
});

db.History = History;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;