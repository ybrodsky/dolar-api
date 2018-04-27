const express = require('express');
const router = express.Router();
const config  = require('config');
const request = require('request');
const bodyParser = require('body-parser');
const _ = require('lodash');
const Cron = require('cron').CronJob;

const randomIntFromInterval = (min,max) => {
    return Math.floor(Math.random()*(max-min+1)+min);
};

new Cron('0 9 * * 1-5', () => {
  setTimeout(() => {
    speak(getRandomMessage(MESSAGES.cron['9']));
  }, randomIntFromInterval(0, 15) * 10000);  
}, null, true, 'America/Argentina/Buenos_Aires');

new Cron('0 16 * * 1-5', () => {
  setTimeout(() => {
    speak(getRandomMessage(MESSAGES.cron['16']));
  }, randomIntFromInterval(0, 15) * 10000);  
}, null, true, 'America/Argentina/Buenos_Aires');

new Cron('0 15 * * 1-5', () => {
  setTimeout(() => {
    speak(getRandomMessage(MESSAGES.cron['15']));
  }, randomIntFromInterval(0, 15) * 10000);  
}, null, true, 'America/Argentina/Buenos_Aires');

const MESSAGES = {
  cron: {
    '9': [
      'Garrlnnggg, otra vez empezaste a llegar tarde?',
      'Gerling estas cagando?',
      'Solo aca eh....',
      [{
        msg: 'Augusto',
        delay: 0,
      }, {
        msg: 'tenes para prestarme el flotador?',
        delay: 2
      }, { 
        msg: 'rico de mierda',
        delay: 5,
      }]
    ],
    '16': [
      'que suerte algunos que ya se van',
      'me acuerdo cuando era pobre, a esta hora todavia me quedaba una horita de burreo',
      [{
        msg: 'bueno, me voy a echar un cago y tomar un cafe.',
        delay: 2,
      }, {
        msg: 'Mi meta es media hora',
        delay: 4,
      }]
    ],
    '15': [
        'me voy a dormir una siesta, esclavos', 
        'bueno, se termina el dia para mi que soy rico',
    ],
  },
  mentions: {
    // el marica
    U8QPXKU76: [
      'cerra el ojete Augusto, haceme el favor',
      'rico inmundo',
      'que cojida de hermana que te hace falta a vos',
      'segui golpeando perros vos',
      ['estoy viendo de comprar unas remeras', 'si te interesa'],
    ],
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
      'andas con ganas de matarlo se ve',
      'sabes lo que te falta a vos para ser paria',
      'porteño',
      'el cbu?',
      'Alejandro "el cuatro botellas" Gerling',
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
        delay: 0,
      }, {
        msg: 'Gerling, como esta tu agenda?',
        delay: 10,
      }, {
        msg: 'Deja, me voy con Mica mejor',
        delay: 15,
      }],
      ['recien me desperte', 'me dormi una siesta'],
      'fijate, hasta que esten echas',
      'ese gol pija. 7000 me costo arreglarle la caja',
      'hay que cojerle a la hermana',
      [{
        msg: 'estoy viendo de irme unos dias a la costa',
        delay: 0,
      }, {
        msg: 'si Mica no quiere ir, a uds les interesa?',
        delay: 3,
      }],
      [{
        msg: 'ayer compre 2kg de cerdo, 1kg de vacio, 14kg de lomo, 2 gallinas y un pavo real por $100',
        delay: 0,
      }, {
        msg: 'voy a empezar con lo de la cetosis de nuevo',
        delay: 10,
      }, {
        msg: 'espero esta vez no estar al borde de la muerte',
        delay: 15,
      }],
      'yo soy un tipo muy querido',
      [{
        msg: 'yo nunca pedi delivery', 
        delay: 0,
      }, {
        msg: 'siempre fui a buscarlo',
        delay: 3,
      }, {
        msg: 'si pido algo lo voy a buscar en bici',
        delay: 5,
      }],
      'una playera tenes gerling, callate mejor',
      'que hincha pelotas que esta mi vieja',
      'pueden creer que se me quedo el auto pija otra vez?',
      'este Pedro, que tipo infeliz',
      'hoy me pongo a revelar las fotos',
      [{
        msg: 'deja de decir huevadas',
        delay: 0,
      },{
        msg: 'que decaido que esta esto',
        delay: 10,
      }, {
        msg: 'como elastico de calzon de Gerling',
        delay: 20,
      }],
      [{
        msg: 'esos postrecitos dia',
        delay: 0,
      }, {
        msg: 'son los danettes de los paria',
        delay: 5,
      }],
      [{
        msg: 'que calor la cajeta del sol',
        delay: 0,
      }, {
        msg: 'que lindo seria estar abajo de una parra',
        delay: 10,
      }, {
        msg: 'tomando un exprimido de naranja',
        delay: 15,
      }], 
      'el dia que no sea pobre el dinero no va a afectar mis decisiones',
      [{
        msg: 'Gerling, si la vieja te deja...',
        delay: 0,
      }, {
        msg: 'contanos como quedo la cosa',
        delay: 10,
      }]
    ],
    // compañeros de trabajo
    C8U60NRC7: [
      'Gerling, como anda Seba?',
      'tranquilo gerlingceo',
      'Como anda la vieja, volvio a llevar torta?',
      [{
        msg: 'que judio que es mi viejo',
        delay: 0,
      }, {
        msg: 'todo el dia sin parar',
        delay: 2,
      }, {
        msg: 'le gusta mandarse la parte',
        delay: 5,
      }, {
        msg: 'no almuerza y despues anda haciendose la victima. Comiendo un sanguche a las apuradas',
        delay: 10,
      }, {
        msg: 'al pedo',
        delay: 20,
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
      as_user: false,
      icon_url: 'https://lh4.googleusercontent.com/-PqfUtG-r_TA/AAAAAAAAAAI/AAAAAAAAG0A/Fo2saIrheoY/photo.jpg',
      username: 'Simour',
    }
  };

  request(options, function (error, response, body) {
    if (error) console.log(error);
  });
};

const processMessage = (message, channel = '#random') => {
  // si el mensaje es un string asi nomas, decirlo
  if (_.isString(message)) {
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
      }, m.delay * 1000);
    });
    
    return;
  }
}

const getRandomMessage = (messages) => {
  return messages[Math.floor(Math.random() * messages.length)];
};

const handleMention = (payload) => {
  const { user, channel } = payload;
  
  let possibleResponses = [];
  
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
    
  processMessage(getRandomMessage(possibleResponses), channel);
}

router.post('/', (req, res, next) => {
  console.log(req.body);
  if(req.body && req.body.challenge) {
    return res.send({challenge: req.body.challenge});
  }
  
  if (req.body.event) {
    if (req.body.event.type === 'app_mention') {
        handleMention(req.body.event);
    }
  }
  
  
  return res.send('ok');
});

module.exports = router;
