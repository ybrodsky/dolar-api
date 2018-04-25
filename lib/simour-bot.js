const express = require('express');
const router = express.Router();
const config  = require('config');
const request = require('request');
const bodyParser = require('body-parser');

const messages = {
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
      'fijate, mas o menos'
    ]
  },
  channels: {
    // random
    C8QPXKZPW: [
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

router.post('/', (req, res, next) => {
  if(req.body && req.body.challenge) {
    return res.send({challenge: req.body.challenge});
  }

  return res.send('ok');
});

module.export = router;
