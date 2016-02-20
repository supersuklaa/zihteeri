
var moment    = require('moment-timezone').tz.setDefault('Europe/Helsinki')
var typify    = require('./typify')
var openhours = require('./openhours')

var itemize = function (msg) {

	// break usertext into parameters

	var user = {}

	user.chat = msg.chat.id
	user.text = msg.text.toLowerCase().split(' ')
	
	user.opt = {
		'cafe': {
			'reaktori': false,
			'hertsi': false,
			'newton': false,
			'sååsbar': false,
			'fusion': false,
			'konehuone': false
		},
		'cafeCount': 0,
		'menu': {
			'salad': false,
			'soup': false,
			'evening': false
		},
		'date': msg.date
	}

	// loop tru parameters

	for (var i = 1; i < user.text.length; i++) {

		switch (user.text[i]) {
			case 'reaktori':
			case 'newton':
			case 'hertsi':
			case 'sååsbar':
			case 'fusion':
			case 'konehuone':
				user.opt.cafe[user.text[i]] = true
				user.opt.cafeCount++
				continue

			case 'salaatti':
				user.opt.menu.salad = true
				continue

			case 'keitto':
				user.opt.menu.soup = true
				continue

			case 'huomenna':
			case 'huomen':
				user.opt.date += 86400 // seconds in 1 day
				continue

			case 'illalla':
			case 'iltaruoka':
			case 'ilta':
				user.opt.menu.evening = true
				continue
		}
	}

	// if user did not specify any restaurants,
	// call the _open -function

	if (user.opt.cafeCount === 0) user.opt = _open(user.opt)

	// finalle send user-object to typifier

	typify(user)
}

// this function checks which cafes were open when user sent msg

var _open = function (opt) {

	var time = moment.unix(opt.date).format('HHmm')
	var day = moment.unix(opt.date).format('dddd').toLowerCase()

	// if user requested evening menu
	if (opt.menu.evening) time = 1620

	for (var cafe in openhours) {

		var open = openhours[cafe][day]

		// if cafe is not open on this day, continue

		if (!open) continue

		// if cafe has a daily break (like reaktori)
		// and it is on, continue to next cafe

		var pause = open.pause

		if (pause) {
			if (time >= pause.from && time < pause.to) {
				continue
			}
		}

		// finally, check if cafe is open 

		if (time >= open.from && time < open.to) {

			opt.cafe[cafe] = true
			opt.cafeCount++

		}

	}

	return opt
	
}

module.exports = itemize