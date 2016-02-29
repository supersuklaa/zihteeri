
var typify    = require('./typify')
var findOpens = require('./findOpens')
var moment    = require('moment-timezone').tz.setDefault('Europe/Helsinki')

var itemize = function (msg) {

	// break usertext into parameters

	var user = {}

	user.chat = msg.chat.id
	user.text = msg.text.toLowerCase().split(' ')
	
	user.opt = {
		'cafe': {
			'reaktori' : false,
			'hertsi'   : false,
			'newton'   : false,
			'sååsbar'  : false,
			'fusion'   : false,
			'konehuone': false
		},
		'cafeCount': 0,
		'menu': {
			'salad': false,
			'vege' : false, 
			'soup' : false,
			'luxus': false
		},
		'evening' : false,
		'tomorrow': false,
		'today'   : false,
		'help'    : false,
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

			case 'fusari':
				user.opt.cafe.fusion = true
				user.opt.cafeCount++
				continue

			case 'kasvis':
			case 'kasvisruoka':
				user.opt.menu.vege = true
				continue

			case 'salaatti':
				user.opt.menu.salad = true
				continue

			case 'keitto':
				user.opt.menu.soup = true
				continue

			case 'massikeisari':
			case 'fyffee_löytyy':
			case 'darrasafka':
				user.opt.menu.luxus = true
				continue

			case 'tänään':
				user.opt.today = true
				continue

			case 'huomenna':
			case 'huomen':
				user.opt.date += 86400 // seconds in 1 day
				user.opt.tomorrow = true
				continue

			case 'illalla':
			case 'iltaruoka':
			case 'ilta':
				user.opt.evening = true
				continue

			case 'help':
				user.opt.help = true
				continue

		}
		
	}

	var time = moment.unix(user.opt.date).format('HHmm')

	if (time > 1600 && !user.opt.tomorrow) user.opt.evening = true

	// if user did not specify any restaurants,
	// call the findOpens -module

	if (user.opt.cafeCount === 0) user.opt = findOpens(user.opt)

	// finally send user-object to typifier

	typify(user)
}

module.exports = itemize