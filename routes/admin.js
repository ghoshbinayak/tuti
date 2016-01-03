'use strict';
var express = require('express');
var router = express.Router();
var requireLogin = require('../middleware').requireLogin;
var ifAdmin = require('../middleware').ifAdmin;
var books = require('../models/books');
var users = require('../models/users');

router.get('/', function(req, res){
	res.send('admin panel');
});

// router.get('/', requireLogin, ifAdmin, function(req, res) {
// 	res.render('admin/home');
// });

// router.get('/books', requireLogin, ifAdmin, function(req, res){
// 	res.render('admin/manage-books');
// });

// router.get('/books/add', requireLogin, ifAdmin, function(req, res){
// 	res.render('admin/add-book');
// });

// router.post('/books/add', requireLogin, ifAdmin, function(req, res){
// 	var book = {};
// 	book.title = req.body.title;
// 	book.isbn  = req.body.isbn;
// 	book.authors = req.body.authors;
// 	book.publisher = req.body.publisher;
// 	book.subject = req.body.subject;
// 	book.notes = req.body.notes;
// 	book.shelf = req.body.shelf;
// 	book.ncopies = req.body.ncopies;
// 	book.nissued = 0;
// 	var promise = books.getbook(book.isbn);
// 	promise.then(function(result){
// 		if(result.length === 0){
// 			books.newentry(book);
// 			res.redirect('/admin/books');
// 		}
// 		else{
// 			res.render('add-book', {error: "The book already exists!"});
// 		}
// 	}).catch(function(err){
// 		res.render('add-book', {error: err});
// 	});
// });

// router.get('/books/remove', requireLogin, ifAdmin, function(req, res){
// 	res.render('admin/remove-book');
// });

// router.post('/books/remove', function(req, res){
// 	var promise = books.findbook(req.body.query, req.body.field);
// 	promise.then(function(result){
// 		if(result.length === 0){
// 			res.render('admin/remove-book', {error: "Nothing found, sorry."});
// 		}
// 		else{
// 			if(req.body.update){
// 				res.render('admin/remove-book', {books: result, update: true});
// 			}
// 			else{
// 				res.render('admin/remove-book', {books: result});
// 			}
// 		}
// 	}).catch(function(err){
// 		res.render('admin/remove-book', {error: err});
// 	});
// });

// router.get('/books/del', requireLogin, ifAdmin, function(req, res){
// 	books.delbook(req.query.isbn);
// 	res.redirect('/admin/books/remove');
// });

// router.get('/books/update', requireLogin, ifAdmin, function(req, res){
// 	if(req.query.isbn){
// 		var promise = books.findbook(req.query.isbn, "isbn");
// 		promise.then(function(result){
// 			if(result.length === 0){
// 				res.render('admin/update-book', {error: "Nothing found, sorry."});
// 			}
// 			else{
// 				res.render('admin/update-book', {book: result[0]});
// 			}
// 		}).catch(function(err){
// 			res.render('admin/update-book', {error: err});
// 		});
// 	}
// 	else {
// 		res.render('admin/update-book');
// 	}
// });

// router.post('/books/update', requireLogin, ifAdmin, function(req, res){
// 	var book = {};
// 	book.title = req.body.title;
// 	book.authors = req.body.authors;
// 	book.publisher = req.body.publisher;
// 	book.subject = req.body.subject;
// 	book.notes = req.body.notes;
// 	book.shelf = req.body.shelf;
// 	book.ncopies = req.body.ncopies;
// 	books.update(req.body.isbn, book);
// 	res.redirect('/admin/books/update');
// });

// router.get('/issue', requireLogin, ifAdmin, function(req, res){
// 	res.render('admin/issue-book');
// });

// router.post('/issue', requireLogin, ifAdmin, function(req, res){
// 	if(req.body.type === 'issue'){
// 		var isbn = req.body.isbn;
// 		var email = req.body.email;
// 		var promise = users.getuser(email);
// 		promise.then(function(result){
// 			if(result.length === 0){
// 				res.render('admin/issue-book', {title: 'Issue book', error: "User doesn't exists"});			
// 			}
// 			else{
// 				var user = result[0];
// 				var secondPromise = books.getbook(isbn);
// 				secondPromise.then(function(secondResult){
// 					if(secondResult.length === 0){
// 						res.render('admin/issue-book', {title: 'Issue book', error: "Book not found"});
// 					}
// 					else if(secondResult[0].nissued >= secondResult.ncopies){
// 						res.render('admin/issue-book', {title: 'Issue book', error: "All copies of the book are out."});
// 					}
// 					else {
// 						books.adduser(secondResult[0].isbn, user._id);
// 						users.addbook(user.email, secondResult[0]._id);
// 						res.redirect('/admin/issue');
// 						return;
// 					}
// 				}).catch(function(err){
// 					res.render('admin/issue-book', {title: 'Issue book', error: err.toString()});
// 				});
// 			}
// 		}).catch(function(err){
// 			res.render('admin/issue-book', {title: 'Issue book', error: err.toString()});
// 		});
// 	}
// 	else if(req.body.type === 'submit') {
// 		res.render('admin/issue-book', {title: 'Issue book', error: 'Submit not implemented yet.'});
// 	}
// 	else {
// 		res.render('admin/issue-book', {title: 'Issue book', error: 'Something is not right.'});
// 	}
// });

module.exports = router;