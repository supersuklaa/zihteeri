
var moment = require('moment-timezone').tz.setDefault('Europe/Helsinki')

module.exports = function (user) {

	var weekday = moment.isoWeekday()
	var usertime = user.select.date.time
	
	if (weekday === 7) {
		// nyt on sunnuntai hessu!
	} else if (weekday === 6 && user.select.date.tomorrow) {
		// huomenna on sunnuntai hessu!
	} else if (user.select.menu.salad && user.select.menu.evening) {
		// salaattia ei tarjoilla illalla hessu!
	} else if (user.select.menu.soup && user.select.menu.evening) {
		// soppaa ei tarjoilla illalla hessu!
	} else if (user.select.cafeCount === 0) {
		if (usertime < 1030) {
			if (user.select.menu.salad) {
				
			}
		}
	}


}