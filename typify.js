
var transmit = require('./transmitter')
var parser   = require('./parser')

var maxCafes = 3

module.exports = function (user) {

	var cafes = []

	for (var cafe in user.opt.cafe) {

		if (user.opt.cafe[cafe]) {

			cafe = cafe.charAt(0).toUpperCase() + cafe.slice(1)
			cafes.push(cafe)

		}

	}

	var addtext = function (text, i) {

		var texter = function (err, meals) {

			if (!err && meals.length > 0) {

				text += '<b>' + cafes[i] + ':</b> ' + meals.join(', ') + '\n\n'

			}

			i++

			if (i === cafes.length || i === maxCafes) sendtext(text)

			else addtext(text, i)	

		}

		parser[cafes[i]](texter, user.opt)

	}

	var sendtext = function (text) {

		var msgOut = {
			'chat_id': user.chat,
			'text': text,
			'parse_mode': 'HTML'
		}

		transmit.msg(msgOut, function (error, response, body) {
			
			if (!error) console.log(body)
 			else console.log(error)

		})
	}

	if (cafes.length > 0) addtext('', 0)	

}