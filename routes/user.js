var express = require('express');
var router = express.Router();
var requireLogin = require('../middleware').requireLogin;
var users = require('../models/users');

router.get('/edit', requireLogin, function(req, res) {
	res.render('user/edit');
});

router.post('/edit', requireLogin, function(req, res) {
	var fullname = req.body.fullname;
	var pass = req.body.password;
	var retype = req.body.retype;

	var promise = users.getuser(req.user.email);
	promise.then(function(result){
		if(result.length === 0){
			res.render('user/edit', {title: 'Edit User Info', error: "Thats strange, you don't exist :/"})
		}
		else{
			if(pass && pass != retype){
				res.render('user/edit', {title: 'Edit User Info', error: "Passwords didn't match"});
			}
			else if(pass){
				var val = users.updateuser(req.user.email, pass, fullname);
				req.session.email = req.user.email;
				res.redirect('/?message=useredited');
			}
			else {
				var val = users.updateuser(req.user.email, undefined, fullname);
				req.session.email = req.user.email;
				res.redirect('/?message=useredited');
			}
		}
	}).catch(function(err){
		res.render('user/edit', {title: 'Edit User Info', error: err.toString()});
	});
});

module.exports = router;
