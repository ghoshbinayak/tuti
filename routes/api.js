'use strict';
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

/* Collection handler */
router.use('/sets', require('./sets'));

/* User profile */
router.use('/user', require('./user'));

/* Custom Pages */
router.use('/pages', require('./pages'));


router.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({error: {message: 'Unauthorized request.',
						 		  type: 'UnauthorizedError'}});
  }
});

/* Unknown api */
router.all('/*', function(req, res){
	res.status(404).json({error: {message: 'Wrong endpoint',
					  type: 'unsupportedAPI'}});
});

module.exports = router;
