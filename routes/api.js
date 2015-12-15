var express = require('express');
var router = express.Router();
var requireLogin = require('../middleware').requireLogin;
var books = require('../models/books');

/* GET home page. */
router.get('/', function(req, res){
	res.send('API');
});

module.exports = router;
