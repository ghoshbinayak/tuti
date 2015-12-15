var express = require('express');
var router = express.Router();
var requireLogin = require('../middleware').requireLogin;
var books = require('../models/books');

/* GET home page. */
router.get('/*', function(req, res){
	res.send('SPA');
});
// router.get('/', function(req, res) {
// 	if(req.session.email){
// 		res.render('home', { title: 'Home' });
// 	}
// 	else if(req.query.message === 'signupsucc'){
// 		res.render('home', { title: 'Home', message: 'Signup successful. You can login now.'});
// 	}
// 	else if(req.query.message === 'useredited'){
// 		res.render('home', { title: 'Home', message: 'Success: User info saved.'});
// 	}
// 	else{
// 		res.render('home', { title: 'Home' });
// 	}
// });

// router.get('/logout', function(req, res){
// 	req.session.destroy();
// 	res.redirect('/');
// });

// router.get('/find', function(req, res){
// 	res.render('find');
// });

// router.post('/find', function(req, res){
// 	var promise = books.findbook(req.body.query, req.body.field);
// 	promise.then(function(result){
// 		if(result.length === 0){
// 			res.render('find', {error: "Nothing found, sorry."});
// 		}
// 		else{
// 			res.render('find', {books: result});
// 		}
// 	}).catch(function(err){
// 		res.render('find', {error: err});
// 	});
// });

module.exports = router;
