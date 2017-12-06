const cron 				= require('cron');
const InfoDolar 	= require('./infodolar.js');
const Historic 		= require('./historic');

let job = new cron.CronJob({
	cronTime: '*/5 9-18 * * 1-5', //cada 5 minutos de lunes a viernes entre las 9 y 18hs
	onTick: () => {
	  getCurrentValue();
	},
	start: true,
	timeZone: 'America/Argentina/Buenos_Aires'
});

const getCurrentValue = () => {
	InfoDolar.getData().then((result) => {
		updateValues(result);
	}, () => {
		console.log('Gdo');
	});
}

const updateValues = (result) => {
	let oficial = {
		type: 'oficial',
		buy: toTwoDecimals(result.oficial.buy),
		sell: toTwoDecimals(result.oficial.sell)
	};

	let blue = {
		type: 'blue',
		buy: toTwoDecimals(result.blue.buy),
		sell: toTwoDecimals(result.blue.sell)
	}

	let mayorista = {
		type: 'mayorista',
		buy: toTwoDecimals(result.mayorista.buy),
		sell: toTwoDecimals(result.mayorista.sell)
	}

	Historic.findOne({
		raw: true,
		order: [['id', 'DESC']],
		where: oficial
	}).then((found) => {
		if(!found) Historic.add(oficial);
	});

	Historic.findOne({
		raw: true,
		order: [['id', 'DESC']],
		where: blue
	}).then((found) => {
		if(!found) Historic.add(blue);
	});

	Historic.findOne({
		raw: true,
		order: [['id', 'DESC']],
		where: mayorista
	}).then((found) => {
		if(!found) Historic.add(mayorista);
	});
}

const toTwoDecimals = (val) => {
	return Math.round(val * 100) / 100;
}

getCurrentValue()