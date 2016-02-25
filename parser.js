
var juvenes  = require('./parsers/juvenes')
var hertsi   = require('./parsers/hertsi')
var reaktori = require('./parsers/reaktori')

module.exports = {

	Newton: juvenes.Newton,
	Sååsbar: juvenes.Sååsbar,
	Fusion: juvenes.Fusion,
	Konehuone: juvenes.Konehuone,
	Hertsi: hertsi,
	Reaktori: reaktori

}