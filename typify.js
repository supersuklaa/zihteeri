
var transmit = require('./transmitter')
var parser   = require('./parser')

var maxCafes = 3

var helptxt  = '<b>Ymmärrän:</b> <i>reaktori, newton, hertsi, sååsbar, fusion, '
    helptxt += 'fusari, konehuone, kasvis, kasviruoka, salaatti, '
    helptxt += 'keitto, massikeisari, fyffee_löytyy, darrasafka, '
    helptxt += 'tänään, huomenna, huomen, illalla, iltaruoka, ilta</i>'

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

			if (!err && meals.length > 0) {

				text += meals.join(', ') + '\n\n'

			} else {

				text += '<i>Ruokalistaa ei saatavilla</i>\n\n'

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

	if (user.opt.help) sendtext(helptxt)
	else if (cafes.length > 0) addtext('', 0)
	else sendtext('Ei ravintoloita auki :(')

}