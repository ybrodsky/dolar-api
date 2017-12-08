const History = require('../models/index').History;
const _				= require('underscore');

const add = (data) => History.create(data);

const findOne = (query) => History.findOne(query);

const findAll = (query) => {
  query = _.extend(query, {
  	raw: true,
  	order: [['id', 'DESC']],
  	attributes: ['type', 'buy', 'sell', 'date']
  });

	return History.findAndCountAll(query);
};

const current = () => {
	let query = {
		order: [['id', 'DESC']],
		raw: true,
    attributes: ['buy', 'sell', 'date']
	};

	return Promise.all([
		History.findOne(_.extend(query, {where: {type: 'oficial'}})),
		History.findOne(_.extend(query, {where: {type: 'blue'}})),
		History.findOne(_.extend(query, {where: {type: 'mayorista'}})),
	]).then((results) => {
		return {oficial: results[0], blue: results[1], mayorista: results[2]};
	});
};

module.exports = { add, findOne, findAll, current };