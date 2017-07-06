const History = require('../models/index').History;
const _				= require('underscore');

const add = (data) => new Promise((resolve, reject) => {
	return resolve(History.create(data));
});

const findOne = (query) => new Promise((resolve, reject) => {
	return resolve(History.findOne(query));
});

const findAll = (query) => new Promise((resolve, reject) => {
  query = _.extend(query, {
  	raw: true,
  	order: [['id', 'DESC']],
  	attributes: ['type', 'buy', 'sell', 'date']
  });

	return History.findAndCountAll(query).then((results) => {
  	return resolve(results);
  });
});

const current = () => new Promise((resolve, reject) => {
	let query = {
		order: [['id', 'DESC']],
		raw: true,
    attributes: ['buy', 'sell', 'date']
	};

	Promise.all([
		History.findOne(_.extend(query, {where: {type: 'oficial'}})),
		History.findOne(_.extend(query, {where: {type: 'blue'}}))
	]).then((results) => {
		return resolve({oficial: results[0], blue: results[1]});
	});
});

module.exports = { add, findOne, findAll, current };