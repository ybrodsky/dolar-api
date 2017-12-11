const cron 				= require('cron');
const InfoDolar 	= require('./infodolar.js');
const Bluelytics 	= require('node-bluelytics');
const Historic 		= require('./historic');
const _ 					= require('underscore');

let job = new cron.CronJob({
	cronTime: '*/5 9-20 * * 1-5', //cada 5 minutos de lunes a viernes entre las 9 y 18hs
	onTick: () => {
	  getCurrentValue();
	},
	start: true,
	timeZone: 'America/Argentina/Buenos_Aires'
});

const getCurrentValue = () => {
	Promise.all([
		InfoDolar.getData(['mayorista']),
		Bluelytics.get('dollar')
	]).then((results) => {
		updateValues(_.extend(results[0], results[1]));
	}).catch((err) => {
		console.log('Error del gdo');
	});
}

const updateValues = (result) => {console.log(result)
	let results = [{
		type: 'oficial',
		buy: toTwoDecimals(result.oficial.value_buy),
		sell: toTwoDecimals(result.oficial.value_sell)
	}, {
		type: 'blue',
		buy: toTwoDecimals(result.blue.value_buy),
		sell: toTwoDecimals(result.blue.value_sell)
	}, {
		type: 'mayorista',
		buy: toTwoDecimals(result.mayorista.buy),
		sell: toTwoDecimals(result.mayorista.sell)
	}];

	results.forEach((result) => {
		Historic.findOne({
			raw: true,
			order: [['id', 'DESC']],
			where: {
				type: result.type
			}
		}).then((found) => {
			if(!found) Historic.add(result);

			if(found.buy != result.buy || found.sell != result.sell) {
				Historic.add(result);
			}
		})
	});
}

const toTwoDecimals = (val) => {
	return Math.round(val * 100) / 100;
}

getCurrentValue()