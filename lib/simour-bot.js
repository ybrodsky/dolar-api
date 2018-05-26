const express = require('express');
const router = express.Router();
const config  = require('config');
const request = require('request');
const bodyParser = require('body-parser');
const _ = require('lodash');
const Cron = require('cron').CronJob;
const MESSAGES = require('./../bot-messages');

let AUTOREPLY = true;

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

  const { event } = req.body;

  if (event) {
    if (event.type === 'app_mention' && AUTOREPLY) {
        handleMention(event);
    } else if (event.type === 'message' && event.channel_type === 'im') {
      if (event.user === 'U8QPXKU76' || event.user === 'U8QQCLVUJ') {
        if (event.text === 'AUTOREPLY') {
          AUTOREPLY = !AUTOREPLY;
          speak(`AUTOREPLY: ${AUTOREPLY}`, event.channel);
        } else if (!AUTOREPLY) {
          speak(event.text);
        } else {
          speak('No se que queres', event.channel);
        }
      }
    }
  }


  return res.send('ok');
});

module.exports = router;
