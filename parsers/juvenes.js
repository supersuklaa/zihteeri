
var request    = require('request')
var moment     = require('moment-timezone').tz.setDefault('Europe/Helsinki')

var apiurl = 'http://www.juvenes.fi/DesktopModules/Talents.LunchMenu/LunchMenuServices.asmx/GetMenuByDate'

var parser = function (kitchen, useropt, callback) {

	// juvenes' API doesn't offer 100% valid json
	// so we download the json as a string,
	// play with it little and
	// then parse it as json

	var date = moment.unix(useropt.date).format('YYYY-MM-DD')

	var opt = {
		url: apiurl +
			"?KitchenId=" + kitchen.id +
			"&MenuTypeId=" + kitchen.menu + 
			"&date='" + date +
			"'&format=json&lang='fi'"
	}

	request(opt, function (error, resp, html) {

		if (!error) {

			try {

				var meals = []

				// make valid json

				html = html.slice(7, -4)
				html = html.replace(/\\"/g, '"')
				var json = JSON.parse(html)

				// search the titles of meals
				
				for (var i in json.MealOptions) {

					var meal = json.MealOptions[i].MenuItems[0].Name

					// if user has requested special menus

					var diets = json.MealOptions[i].MenuItems[0].Diets.split(',')
					var type = json.MealOptions[i].Name

					if (useropt.menu.vege && diets.indexOf('KA') < 0) continue
					else if (useropt.menu.soup && meal.indexOf('keitto') < 0) continue
					else if (useropt.menu.luxus) {
						if (type.indexOf('FUSION') < 0) {
							if (type.indexOf('ROHEE XTRA') < 0) continue
						}
					}

					// juvenes' api really doesn't care for salads :( so skip

					else if (useropt.menu.salad) continue

					// if we get this far, add meal to 'meals'

					meals.push(meal.trim())

				}

				callback(null, meals)

			} catch(err) {

				callback(err, null)

			}

		} else {

			callback(error, null)

		}

	})

}

// check http://www.juvenes.fi/DesktopModules/Talents.LunchMenu/LunchMenuServices.asmx
// for API documentation ( ~ kitchen and menu IDs)

module.exports = {

	Newton: function (callback, useropt) {

		var kitchen = {id: 6, menu: 60}

		parser(kitchen, useropt, callback)

	},

	Sååsbar: function (callback, useropt) {

		var kitchen = {id: 6, menu: 77}

		parser(kitchen, useropt, callback)

	},

	Fusion: function (callback, useropt) {

		var kitchen = {id: 60038, menu: 3}

		parser(kitchen, useropt, callback)

	},

	Konehuone: function (callback, useropt) {

		var kitchen = {id: 60038, menu: 74}

		parser(kitchen, useropt, callback)

	}
}
