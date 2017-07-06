const express = require('express');
const app 		= express();
const config  = require('config');
const _				= require('underscore');

const History = require('../models/index').History;
const attributes = ['type', 'buy', 'sell', 'date'];

app.set('view engine', 'ejs');
app.disable('x-powered-by');
app.use(function(req, res, next) {
  res.setHeader('gdo', 'Gdo de las pampas');
  next();
});


app.get('/', (req, res) => {
  return res.render(process.cwd() + '/views/index');
});

app.get('/api/current', (req, res) => {
	let query = {
		order: [['id', 'DESC']],
		raw: true,
    attributes
	};

	Promise.all([
		History.findOne(_.extend(query, {type: 'oficial'})),
		History.findOne(_.extend(query, {type: 'blue'}))
	]).then((results) => {
		return res.send({oficial: results[0], blue: results[1]});
	}).catch((err) => {console.log(err)
		return res.send({error: 'Looks like the server did a Gdo. Sorry =/'});
	});
});

app.get('/api/:type?', (req, res) => {
  let limit 	= req.query.limit || 30;
  let offset 	= req.query.offset || req.query.skip || 0;
  let order 	= req.query.order || req.query.sort || 'DESC';

  let query = {
  	raw: true,
  	limit: parseInt(limit),
  	offset: parseInt(offset),
  	order: [['id', order]],
    attributes
  }

  if(req.params.type) {
  	query.where = {type: req.params.type};
  }

  History.findAndCountAll(query).then((results) => {
  	return res.send(results);
  }).catch((err) => {
  	return res.send({error: 'Looks like the server did a Gdo. Sorry =/'});
  });
});

app.listen(config.get('server').port, () => {
  console.log(`Example app listening on port ${config.get('server').port}!`)
});