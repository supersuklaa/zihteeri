
var request = require('request')
var moment  = require('moment-timezone').tz.setDefault('Europe/Helsinki')

var apiurl = 'http://www.sodexo.fi/ruokalistat/output/daily_json/12812/{date}/fi'

module.exports = function (callback, useropt) {

	// makes an array of hertsi's meals of current date

	var date = moment.unix(useropt.date).format('YYYY/MM/DD')
	var opt = {
		url: apiurl.replace('{date}', date),
		json: true
	}

	// request the json

	request(opt, function (error, resp, json) {

		if (!error) {

			var meals = []

			var categories = [
				'Inspiring',
				'Soup',
				'Popular',
				/*'Wok',
				'Warm Salad',
				'Vitality',*/
				'Vegetarian'
			]

			// check for special menus

			var usermenu = useropt.menu

			if (usermenu.salad || usermenu.vege || usermenu.soup) {

				categories = []

				if (usermenu.salad) categories.push('Warm Salad', 'Salad')
				if (usermenu.vege) categories.push('Vegetarian')
				if (usermenu.soup) categories.push('Soup')

			}

			if (usermenu.luxus) categories = ['Vitality']

			// search the titles of meals

			for (var i in json.courses) {

				var menu = json.courses[i]

				// skip the unwanted categories
				if (categories.indexOf(menu.category) < 0) continue

				var meal = menu.title_fi
				if (meal) meals.push(meal.trim())

			}

			callback(null, meals)

		} else {

			callback(error, null)

		}

	})
}