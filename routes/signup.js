var express = require('express');
var router = express.Router();
var	users = require('../models/users');
var	scrypt = require('scrypt');
var email_validator = require('email-validator');

router.post('/', function(req, res){
	var fullname = req.body.fullname;
	var email = req.body.email;
	var pass = req.body.password;
	var retype = req.body.retype;
	if(!email_validator.validate(email)){
		res.status(400).json({ error: {message: 'Invalid email address.',
						   type: 'SignUpFailed'}});
	}
	else{
		var promise = users.get(email);
		promise.then(function(result){
			if(!result){
				if(pass != retype){
					res.status(400).json({ error: {message: "Passwords didn't match.",
									   type: 'SignUpFailed'}});
				}
				else{
					users.create(email, pass, fullname).then(function(result){
						res.status(200).json({ success: {message: 'User created! Check email.',
											   user: {email: result.email,
											   		  id: result._id}}});
					}).catch(function(err){
						res.status(400).json({ error: {message: err.toString(),
											   type: 'DBerror'}});						
					});
				}
			}
			else{
				res.status(400).json({ error: {message: "The email is already registered.",
								   type: 'SignUpFailed',
								   html: '<a href=\'/auth/forgot\'>Frogot password?</a>'}});
			}
		}).catch(function(err){
			res.status(400).json({ error: {message: err.toString(),
							   type: 'SignUpFailed'}});
		});
	}
});

module.exports = router;
