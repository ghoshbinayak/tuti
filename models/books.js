'use strict';
var db = require('mongoskin').db('mongodb://localhost:27017/test');

var getbook = function(isbn){
	return new Promise(function(resolve, reject){
		var books = db.collection('books');
		var res = books.find({"isbn": isbn}).limit(1);
		res.toArray(function(err, arr){
			if(!err){
				resolve(arr);
			}
			else{
				reject("Something went wrong");
			}
			db.close();
		});
	});
};

var newentry = function(book) {
	var books = db.collection('books');
	book.users = [];
	var res = books.insert(book);
	db.close();
	return res;
};

var update = function(isbn, book){
	var books = db.collection('books');
	var res = books.update({isbn: isbn}, {$: book});
	db.close();
	return res;
};

var adduser = function(isbn, userid) {
	var books = db.collection('books');
	var res = books.update({isbn: isbn}, {$push: {users: userid}, $inc: {nissued: 1}});
	db.close();
	return res;
};

var removeuser = function (isbn, userid) {
	var books = db.collection('books');
	var res = books.update({isbn: isbn}, {$pull: {users: userid}, $inc: {nissued: -1}});
	db.close();
	return res;
};

var findbook = function(querry, type){
	var promise;
	if(type === "title"){
		promise = new Promise(function(resolve, reject){
			var books = db.collection('books');
			var res = books.find({"title": new RegExp(querry, "i")});
			res.toArray(function(err, arr){
				if(!err){
					resolve(arr);
				}
				else{
					reject("Something went wrong");
				}
				db.close();
			});
		});
	}
	else if(type == "author"){
		promise = new Promise(function(resolve, reject){
			var books = db.collection('books');
			var res = books.find({"authors": new RegExp(querry, "i")});
			res.toArray(function(err, arr){
				if(!err){
					resolve(arr);
				}
				else{
					reject("Something went wrong");
				}
				db.close();
			});
		});
	}
	else{
		promise = getbook(querry);
	}
	return promise;
};

var delbook = function(isbn) {
	var books = db.collection('books');
	var res = books.remove({isbn: isbn});
	db.close();
	return res;
};

module.exports = {
	getbook: getbook,
	newentry: newentry,
	findbook: findbook,
	delbook: delbook,
	update: update,
	adduser: adduser,
	removeuser: removeuser
};

process.on('SIGINT', function() {
    console.log('Recieve SIGINT');
    db.close(function(){
        console.log('database connection has been closed.');
        process.exit();
    });
});