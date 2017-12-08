const cron 				= require('cron');
const InfoDolar 	= require('./infodolar.js');
const Historic 		= require('./historic');

let job = new cron.CronJob({
	cronTime: '*/5 9-20 * * 1-5', //cada 5 minutos de lunes a viernes entre las 9 y 18hs
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
	let results = [{
		type: 'oficial',
		buy: toTwoDecimals(result.oficial.buy),
		sell: toTwoDecimals(result.oficial.sell)
	}, {
		type: 'blue',
		buy: toTwoDecimals(result.blue.buy),
		sell: toTwoDecimals(result.blue.sell)
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