
var restaurant = require('../resources/restaurants').hertsi
var request    = require('request')
var moment     = require('moment-timezone').tz.setDefault('Europe/Helsinki')

module.exports = function (callback) {

	// makes an array of hertsi's meals of current date

	var date = moment().format('YYYY/MM/DD')
	var opt = {
		url: restaurant.url + date + '/fi',
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