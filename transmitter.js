
var request = require('request')

var botToken = process.env.TELEGRAM_APIKEY
var botURL = 'https://api.telegram.org/bot' + botToken

// sends msg to telegram

module.exports = {
	
	msg: function (params, callback) {

		var url = botURL + '/sendMessage'

		console.log(params)

		request.post(url, {form: params}, callback)

	}

}