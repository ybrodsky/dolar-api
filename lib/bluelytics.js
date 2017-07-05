const request = require('request');
const URL = 'http://api.bluelytics.com.ar/v2/latest';

module.exports = {
	fetch: () => new Promise((resolve, reject) => {
		request({
			method: 'GET',
			keepAlive: false,
			url: URL,
			headers: {
				'Accept': 'application/json',
				'Accept-Encoding': 'gzip'
			},
			gzip: true
		}, (err, response, body) => {
			if(!body) return reject();

			try {
				body = JSON.parse(body);
				return resolve(body);
			} catch(e) {
				return reject();
			}
		});
	})
}