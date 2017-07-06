const express = require('express');
const app 		= express();
const config  = require('config');

const Historic = require('./historic');

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
	Historic.current().then((result) => {
    return res.send(result);
  });
});

app.get('/api/:type?', (req, res) => {
  let limit 	= req.query.limit || 30;
  let offset 	= req.query.offset || 0;

  let query = {
  	limit: parseInt(limit),
  	offset: parseInt(offset)
  }

  if(req.params.type) {
  	query.where = {type: req.params.type};
  }

  Historic.findAll(query).then((result) => {
    return res.send(result);
  });
});

app.listen(config.get('server').port, () => {
  console.log(`Example app listening on port ${config.get('server').port}!`)
});