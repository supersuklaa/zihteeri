
var request = require('request')
var moment  = require('moment-timezone').tz.setDefault('Europe/Helsinki')

var apiurl = 'http://www.amica.fi/modules/json/json/Index?costNumber=0812&firstDay={date}&language=fi'

// little function to make output prettier

var _cleaner = function (meal) {

	// some restaurants include (M,G) -stuff in
	// the names of meals, this removes them
	var split = meal.split('(')

	// also some names of meals had useless whitespace
	var output = split[0].replace('*', '').trim()

	return output

}

var _parsemeals = function (menu, useropt) {
	
	var time = moment.unix(useropt.date).format('HHmm')

	// if user requested tomorrow's menus
	if (useropt.tomorrow) time = 1200

	// if user requested evening menu
	if (useropt.evening) time = 1620

	var meals = []

	var categories = [
		/*'Linjasto',
		'Kasvislounas',
		'Keittolounas',
		'Leipäateria',
		'Salaattilounas',
		'Special',
		'Iltaruoka',
		'Jälkiruoka',
		'A´la carte',*/
	]

	// check for special menus

	var usermenu = useropt.menu

	if (usermenu.salad) categories.push('Salaattilounas')
	if (usermenu.vege) categories.push('Kasvislounas')
	if (usermenu.soup) categories.push('Keittolounas')
	if (usermenu.luxus) categories.push('Special')

	// if it's evenight or user requested evening menu

	if (time > 1600) {

		if (categories.length > 0) categories = []

		else categories = ['Iltaruoka']

	}

	// "the basic"

	else if (categories.length < 1) {
		categories.push(
			'Linjasto',
			'Kasvislounas',
			'Keittolounas'
		)
	}

	for (var i in menu) {

		// skip the unwanted categories
		if (categories.indexOf(menu[i].Name) < 0) continue

		var meal = menu[i].Components[0]
		if (meal) meals.push(_cleaner(meal))
				
	}

	return meals
}

module.exports = function (callback, useropt) {

	var date = moment.unix(useropt.date).format('YYYY-MM-DD')

	var opt = {
		url: apiurl.replace('{date}', date),
		json: true
	}

	// request the json

	request(opt, function (error, resp, json) {

		if (!error) {

			var meals = []

			// reaktori only offers json of whole week's menus
			// so we need 2 loops: first find right date
			// then find right meals (= _parsemeals function)

			// looping json to find right date

			for (var i in json.MenusForDays) {

				var menudate = json.MenusForDays[i].Date
				var menus = json.MenusForDays[i].SetMenus

				if (menudate.substring(0, 10) === date) {
					meals = _parsemeals(menus, useropt)
					break
				}

			}

			callback(null, meals) 

		} else {

			callback(error, null)

		}
	})
}