
var openingHours = require('./openhours')
var moment       = require('moment-timezone').tz.setDefault('Europe/Helsinki')

module.exports = function (opt) {

	var date = moment.unix(opt.date)

	var time = date.format('HHmm')
	var day = date.format('dddd').toLowerCase()

	// if it is evening
	if (time > 1600) opt.evening = true

	// if user requested evening menu
	if (opt.evening) time = 1620

	// if user requested tomorrow's menus
	else if (opt.tomorrow) time = 1200

	// if user requested today's menus (before opening time)
	else if (opt.today && time < 1200) time = 1200

	for (var cafe in openingHours) {

		var open = openingHours[cafe][day]

		// if cafe is not open on this day, continue to next cafe

		if (!open) continue

		// if cafe has a daily break (like reaktori)
		// and the break is on, continue to next cafe

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