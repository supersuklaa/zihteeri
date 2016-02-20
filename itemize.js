
var moment    = require('moment-timezone').tz.setDefault('Europe/Helsinki')
var reply     = require('./reply')
var openhours = require('./openhours')

var itemize = function (msg) {

	// break usertext into parameters

	var user = {}

	user.chat = msg.chat.id
	user.text = msg.text.toLowerCase().split(' ')
	
	user.select = {
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

	for (var i in user.text.length) {

		if (i === 0) continue // skip '/ruoka' -command

		switch (user.text[i]) {
			case 'reaktori':
			case 'newton':
			case 'hertsi':
			case 'sååsbar':
			case 'fusion':
			case 'konehuone':
				user.select.cafe[user.text[i]] = true
				user.select.cafeCount++
				continue

			case 'salaatti':
				user.select.menu.salad = true
				continue

			case 'keitto':
				user.select.menu.soup = true
				continue

			case 'huomenna':
				user.select.date += 86400 // seconds in 1 day
				continue

			case 'illalla':
			case 'iltaruoka':
			case 'ilta':
				user.select.menu.evening = true
				continue
		}
	}

	// if user did not specify any restaurants

	if (user.select.cafeCount === 0) {

		var time = moment.unix(user.select.date).format('HHmm')
		var day = moment.unix(user.select.date).format('dddd')

		// if user requested evening menu
		if (user.select.menu.evening) time = 1620

		var opencafes = _open(time, day)

		user.select.cafe = opencafes.cafe
		user.select.cafeCount = opencafes.cafeCount

	}

	console.log(user)
}

var _open = function (time, day) {

	var output = {
		'cafe': {
			'reaktori': false,
			'hertsi': false,
			'newton': false,
			'sååsbar': false,
			'fusion': false,
			'konehuone': false
		},
		'cafeCount': 0
	}

	for (var cafe in openhours) {

		var open = openhours[cafe][day]
		var pause = openhours[cafe][day].pause

		// if cafe has a daily break (like reaktori)
		// and it is on, continue to next cafe

		if (pause) {
			if (time >= pause.from && time < pause.to) {
				continue
			}
		}

		if (time >= open.from && time < open.to) {

			output.cafe[cafe] = true
			output.cafeCount++

		}

	}

	return output
	
}

module.exports = itemize