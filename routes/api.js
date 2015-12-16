var express = require('express');
var router = express.Router();
var requireLogin = require('../middleware').requireLogin;
var books = require('../models/books');
var	users = require('../models/users');
var	scrypt = require('scrypt');
var email_validator = require('email-validator');


/* Version */
router.get('/v', function(req, res){
	res.json({version: '0.0.1'});
});

/* Login handler */
router.use('/login', require('./login'));

/* Signup handler */
router.use('/signup', require('./signup'));

/* Product handler */
router.use('/products', require('./products'));

/* Unknown api */
router.all('/*', function(req, res){
	res.json({error: {message: 'Wrong endpoint',
					  type: 'unsupportedAPI'}});
});

module.exports = router;