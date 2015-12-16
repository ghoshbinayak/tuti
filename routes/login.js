var express = require('express');
var router = express.Router();
var	users = require('../models/users');
var	scrypt = require('scrypt');

/* Login handler */
router.post('/', function(req, res){
	var email = req.body.email;
	var pass = req.body.password;
	var promise = users.getuser(email);
	console.log(req.body);
	promise.then(function(result){
		if(result.length === 0){
			res.status(401).json({ error: {'message': 'Invalid email or password.' + email,
										   'type': 'AuthFailure'
									}});
		}
		else{
			var isvalid = scrypt.verifyKdfSync(result[0].pass.buffer, pass);
			if(isvalid){

				/* TODO: add JWT support */
				res.status(200).json({ user: {'email': email,
											  'isStaff': true,
						}});
			}
			else{
				res.status(401).json({ error: {'message': 'Invalid email or password.',
										   'type': 'AuthFailure'
										}});
			}
		}
	}).catch(function(err){
		res.status(401).json({ error: {'message': err.toString(),
								   'type': 'AuthFailure'
								}});
	});
});

module.exports = router;