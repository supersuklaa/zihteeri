
var transmit = require('./transmitter')

module.exports = function (user) {

	var msgOut = {
		'chat_id': user.chat,
	}

	if (user.opt.cafeCount === 0) {

		msgOut.text = 'Sori ei rafloi auki :('

		transmit.msg(msgOut, function (error, response, body) {
			
			if (!error) console.log(body)
 			else console.log(error)

		})

	}

}