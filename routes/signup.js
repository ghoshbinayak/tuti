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
		res.status(400).json({ error: {'message': 'Invalid email address.' + fullname,
						   'type': 'SignUpFailed'
						}});
	}
	else{
		var promise = users.getuser(email);
		promise.then(function(result){
			if(result.length === 0){
				if(pass != retype){
					res.status(400).json({ error: {'message': "Passwords didn't match.",
									   'type': 'SignUpFailed'
									}});
				}
				else{
					users.createuser(email, pass, fullname);
					res.status(200).json({ success: 'User created! Check email.',
										   user: email
						});
				}
			}
			else{
				res.status(400).json({ error: {'message': "The email is already registered.",
								   'type': 'SignUpFailed',
								   'html': '<a href=\'/auth/forgot\'>Frogot password?</a>'
								}});
			}
		}).catch(function(err){
			res.status(400).json({ error: {'message': err.toString(),
							   'type': 'SignUpFailed'
							}});
		});
	}
});

module.exports = router;
