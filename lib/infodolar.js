const cheerio 	= require('cheerio');
const request 	= require('request');

const URL = {
	oficial: 'http://www.infodolar.com/cotizacion-dolar.aspx',
	blue: 'http://www.infodolar.com/cotizacion-dolar-blue.aspx',
	mayorista: 'http://www.infodolar.com/cotizacion-dolar-mayorista.aspx'
}

const getHTML = (currency) => new Promise((resolve, reject) => {
	request.get(URL[currency], (error, response, body) => {
		if(error) return reject(error);

		return resolve({currency, body: body});
	});
});

const normalizeValue = (txt) => {
	return parseFloat(txt.replace('$', '').replace(',', '.').trim());
}

const parseResults = (results) => {
	let parsed = {};

	results.forEach(result => {
		let $ = cheerio.load(result.body);

		parsed[result.currency] = {
			buy: normalizeValue($('.compraPrecio').text()),
			sell: normalizeValue($('.ventaPrecio').text())
		}
	});

	return parsed;
}

const getData = (currencies = ['oficial', 'blue', 'mayorista']) => {
	return Promise.all(
		currencies.map(currency => {
			return getHTML(currency);
		})
	).then((results) => {
		return parseResults(results);
	});
}


module.exports = { getData }