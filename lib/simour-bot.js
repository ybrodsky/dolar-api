const express = require('express');
const router = express.Router();
const config  = require('config');
const request = require('request');
const bodyParser = require('body-parser');
const _ = require('lodash');

const MESSAGES = {
  cron: {
    '09:00': [
      'Garrlnnggg, otra vez empezaste a llegar tarde?',
      'Gerling estas cagando?',
      'Solo aca eh....',
      [{
        msg: 'Augusto',
        delay: 2,
      }, {
        msg: 'tenes para prestarme el flotador?',
        delay: 1
      }, { 
        msg: 'rico de mierda',
        delay: 0,
      }]
    ],
    '16:00': [
      'que suerte algunos que ya se van',
      'me acuerdo cuando era pobre, a esta hora todavia me quedaba una horita de burreo',
      [{
        msg: 'bueno, me voy a echar un cago y tomar un cafe.',
        delay: 2,
      }, {
        msg: 'Mi meta es media hora',
        delay: 0,
      }}
    ],
    '15:00': ['me voy a dormir una siesta, esclavos'],
  },
  mentions: {
    // el gdo
    U8Q8BSMQ9: [
      'Cerra el ogt Gerling',
      'estas cagando Gerling?',
      'se ve que la vieja no esta hoy',
      'no entendi',
      'Gaaaaaaaaaaaaaaarleeeen',
      'fijate, mas o menos',
      'desconozco',
      'depende para quien',
      'no se mucho del tema',
      'cansado',
      'renuncia marica',
      'Que ojete que tiene esa Milena',
    ]
  },
  channels: {
    // random
    C8QPXKZPW: [
      'me compre un jugo marca dia por $10. Que veneno que es, pero que barato',
      'anoche hicimos 50 vueltas, 600 dominadas, 1235 abdominales y 47 sentadillas. estoy muerto',
      'me voy a echar un cago de media hora',
      'esa Ceci, como gasta guita',
      [{
        msg: 'Este fin de semana capaz voy para alla.',
        delay: 3,
      }, {
        msg: 'Gerling, como esta tu agenda?',
        delay: 10,
      }, {
        msg: 'Deja, me voy con Mica mejor',
        delay: 0,
      }],
      ['recien me desperte', 'me dormi una siesta'],
      'fijate, hasta que esten echas',
      'ese gol pija. 7000 me costo arreglarle la caja',
      'hay que cojerle a la hermana',
      [{
        msg: 'estoy viendo de irme unos dias a la costa',
        delay: 3,
      }, {
        msg: 'si Mica no quiere ir, a uds les interesa?',
        delay: 0,
      }],
      [{
        msg: 'ayer compre 2kg de cerdo, 1kg de vacio, 14kg de lomo, 2 gallinas y un pavo real por $100',
        delay: 5,
      }, {
        msg: 'voy a empezar con lo de la cetosis de nuevo',
        delay: 10,
      }, {
        msg: 'espero esta vez no estar al borde de la muerte',
      }],
      'yo soy un tipo muy querido',
      [{
        msg: 'yo nunca pedi delivery', 
        delay: 2,
      }, {
        msg: 'siempre fui a buscarlo',
        delay: 3,
      }, {
        msg: 'si pido algo lo voy a buscar en bici',
        delay: 1,
      }],
      'una playera tenes gerling, callate mejor',
    ],
    // compañeros de trabajo
    C8U60NRC7: [
      'Gerling, como anda Seba?',
      'tranquilo gerlingceo',
      'Como anda la vieja, volvio a llevar torta?',
      [{
        msg: 'que judio que es mi viejo',
        delay: 4,
      }, {
        msg: 'todo el dia sin parar',
        delay: 1,
      }, {
        msg: 'le gusta mandarse la parte',
        delay: 2,
      }, {
        msg: 'no almuerza y despues anda haciendose la victima. Comiendo un sanguche a las apuradas',
        delay: 1,
      }, {
        msg: 'al pedo',
        delay: 0,
      }],
      'que lindo que se siente ser judio rico',
    ]
  }
  
};

const speak = (msg, channel = '#random') => {
  var options = {
    method: 'POST',
    url: 'https://slack.com/api/chat.postMessage',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
      token: config.get('slackSimourApiKey'),
      channel: channel,
      text: msg,
    }
  };

  request(options, function (error, response, body) {
    if (error) console.log(error);
  });
};

const processMessage = (message, channel = '#random') => {
  // si el mensaje es un string asi nomas, decirlo
  if (_.isString(message) {
    return speak(message, channel);    
  }
  
  // si es un array, puede ser un array de strings o un array de objetos
  // los strings van asi nomas, los objetos tienen un delay para crear el efecto
  // de la diccion pachorrienta de Simour
  if (_.isArray(message)) {
    message.forEach((m) => {
      if (_.isString(m)) {
        return speak(m, channel);
      }
      
      setTimeout(() => {
        speak(m.msg, channel);  
      }, m.delay);
    });
    
    return;
  }
}

const handleMention = (payload) => {
  const { user, channel } = payload;
  
  const possibleResponses = [];
  
  // meter respuestas posibles a menciones de cierto usuario
  if (MESSAGES.mentions[user]) {
    possibleResponses = possibleResponses.concat(MESSAGES.mentions[user]);
  }
  
  // meter respuestas posibles a ciertos canales
  if (MESSAGES.channels[channel]) {
    possibleResponses = possibleResponses.concat(MESSAGES.channels[channel]);
  }
  
  // si estamos sin nada, agarrar algo de random
  if (possibleResponses.length === 0) {
    possibleResponses = MESSAGES.channels.C8QPXKZPW;
  }
  
  const randomMsg = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
  
  processMessage(randomMsg, channel);
}

router.post('/', (req, res, next) => {
  if(req.body && req.body.challenge) {
    return res.send({challenge: req.body.challenge});
  }

  return res.send('ok');
});

module.export = router;
