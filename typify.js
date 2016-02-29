
var transmit  = require('./transmitter')
var parser    = require('./parser')
var errorMsgs = require('./errorMsgs')

var maxCafes = 3

module.exports = function (user) {

	// Make a list of desired cafes

	var cafes = []

	for (var cafe in user.opt.cafe) {

		if (user.opt.cafe[cafe]) {

			cafe = cafe.charAt(0).toUpperCase() + cafe.slice(1)
			cafes.push(cafe)

		}

	}

	// Add text to bot's response

	var addtext = function (text, i) {

		var texter = function (err, meals) {

			text += '<b>' + cafes[i] + ':</b> '

			if (!err) {
				
				if (meals.length > 0) text += meals.join(', ') + '\n\n'
				else text += errorMsgs.nocat


			} else {

				text += errorMsgs.nomenu

			}

			i++

			if (i === cafes.length || i === maxCafes) sendtext(text)
			else addtext(text, i)

		}

		parser[cafes[i]](texter, user.opt)

	}

	// Send bot's response

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

	// Start initializing response

	if (user.opt.help) sendtext(errorMsgs.help)
	else if (cafes.length > 0) addtext('', 0)
	else sendtext(errorMsgs.closed)

}