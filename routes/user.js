'use strict';
var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();
var users = require('../models/users');
var config = require('../options');


router.get('/info/:id', jwt({secret: config.dbConfig.jwtSecret}), function(req, res){
	var uid = req.params.id;
	var user = users.getuser(uid);
	user.then(function(result){
		if(result){
			res.json({success: {message: 'User found.',
								user: result}});
		}
		else{
			res.status(404).json({error: {message: 'User doesn\'t exist.',
										  type: 'resourceNotFound'}});
		}
	}).catch(function(err){
		res.status(400).json({error: {message: err.toString(),
									  type: 'DBerror'}});
	});
});

// router.post('/edit', function(req, res) {
// 	var fullname = req.body.fullname;
// 	var pass = req.body.password;
// 	var retype = req.body.retype;

// 	var promise = users.getuser(req.user.email);
// 	promise.then(function(result){
// 		if(result.length === 0){
// 			res.render('user/edit', {title: 'Edit User Info', error: "Thats strange, you don't exist :/"})
// 		}
// 		else{
// 			if(pass && pass != retype){
// 				res.render('user/edit', {title: 'Edit User Info', error: "Passwords didn't match"});
// 			}
// 			else if(pass){
// 				var val = users.updateuser(req.user.email, pass, fullname);
// 				req.session.email = req.user.email;
// 				res.redirect('/?message=useredited');
// 			}
// 			else {
// 				var val = users.updateuser(req.user.email, undefined, fullname);
// 				req.session.email = req.user.email;
// 				res.redirect('/?message=useredited');
// 			}
// 		}
// 	}).catch(function(err){
// 		res.render('user/edit', {title: 'Edit User Info', error: err.toString()});
// 	});
// });

module.exports = router;
