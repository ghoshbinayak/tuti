'use strict';
var express = require('express');
var router = express.Router();
var	users = require('../models/users');
var	scrypt = require('scrypt');
var jsign = require('jsonwebtoken');
var config = require('../options');


/* Login handler */
router.post('/', function(req, res){
	var email = req.body.email;
	var pass = req.body.password;
	var promise = users.get(email);
	promise.then(function(result){
		if(!result){
			res.status(401).json({ error: {'message': 'Invalid email or password.' + email,
										   'type': 'AuthFailure'
									}});
		}
		else{
			var isvalid = scrypt.verifyKdfSync(result.pass.buffer, pass);
			if(isvalid){

				/* TODO: add JWT support */
				var user = {id: result._id,
							isadmin: result.isadmin};
				var token = jsign.sign(user, config.dbConfig.jwtSecret);
				res.status(200).json({ success: {user: {email: email,
											  			id: result._id.toString()},
												 token: token}
									});
			}
			else{
				res.status(401).json({ error: {'message': 'Invalid email or password.',
										   'type': 'AuthFailure'
										}});
			}
		}
	}).catch(function(err){
		console.log(err);
		res.status(500).json({ error: {'message': 'Something went wrong',
								   'type': 'AuthFailure'
								}});
	});
});

module.exports = router;