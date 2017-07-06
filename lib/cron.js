const cron 				= require('cron');
const Bluelytics 	= require('node-bluelytics');
const History 		= require('../models/index').History;

let job = new cron.CronJob({
	cronTime: '*/5 9-18 * * 1-5', //cada 5 minutos de lunes a viernes entre las 9 y 18hs
	onTick: () => {
	  getCurrentValue();
	},
	start: true,
	timeZone: 'America/Argentina/Buenos_Aires'
});

const getCurrentValue = () => {
	Bluelytics.get().then((result) => {
		updateValues(result);
	}, () => {
		console.log('Gdo');
	});
}

const updateValues = (result) => {
	let oficial = {
		type: 'oficial',
		buy: toTwoDecimals(result.oficial.value_buy),
		sell: toTwoDecimals(result.oficial.value_sell)
	};

	let blue = {
		type: 'blue',
		buy: toTwoDecimals(result.blue.value_buy),
		sell: toTwoDecimals(result.blue.value_sell)
	}

	History.findOne({
		raw: true,
		order: [['id', 'DESC']],
		where: oficial
	}).then((found) => {
		if(!found) History.create(oficial);
	});

	History.findOne({
		raw: true,
		order: [['id', 'DESC']],
		where: blue
	}).then((found) => {
		if(!found) History.create(blue);
	});
}

const toTwoDecimals = (val) => {
	return Math.round(val * 100) / 100;
}

getCurrentValue()