
var juvenes  = require('./parsers/juvenes')
var hertsi   = require('./parsers/hertsi')
var reaktori = require('./parsers/reaktori')

module.exports = {

	newton: juvenes.Newton,
	sååsbar: juvenes.Sååsbar,
	fusion: juvenes.Fusion,
	konehuone: juvenes.Konehuone,
	hertsi: hertsi,
	reaktori: reaktori

}