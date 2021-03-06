const express = require('express');
const app 		= express();
const config  = require('config');
const request = require('request');
const bodyParser = require('body-parser');
const Historic = require('./historic');

app.set('view engine', 'ejs');
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('gdo', 'Gdo de las pampas');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");

  if (req.method === 'OPTIONS') {
    return res.end();
  }

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

app.post('/api/slack-api', (req, res) => {
  if(req.body && req.body.challenge) {
    return res.send({challenge: req.body.challenge});
  }

  Historic.current().then((result) => {
    var options = {
      method: 'POST',
      url: 'https://slack.com/api/chat.postMessage',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      form: {
        token: config.get('slackApiKey'),
        channel: '#dolar',
        text: `
Reemplazando a Gerling en 10 lineas de codigo:
Oficial | Compra: ${result.oficial.buy} - Venta: ${result.oficial.sell}
Blue | Compra: ${result.blue.buy} - Venta: ${result.blue.sell}

Marica.
        `
      }
    };

    request(options, function (error, response, body) {
      if (error) console.log(error);

      return res.send('ok');
    });
  });
})

app.use('/api/slack-api/simour', require('./simour-bot'));

app.listen(config.get('server').port, () => {
  console.log(`Example app listening on port ${config.get('server').port}!`)
});
