
var express    = require('express')
var bodyParser = require('body-parser')
var app        = express()

var itemize    = require('./itemize')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/api/webhook', function (req, res) {

	var msg = req.body.message

	var usertext = msg.text || ''

	if (usertext.substring(0, 6).toLowerCase() === '/ruoka') {

		itemize(msg)

	}

	res.status(200).send({}) // answer 200 ('OK') to telegram
})

var port = process.env.PORT || 8080

app.listen(port)

console.log('Magic happens on port ' + port)

