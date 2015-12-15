'usersse strict'
var db = require('mongoskin').db('mongodb://localhost:27017/test'),
	scrypt = require('scrypt'),
	randomstring = require('randomstring');

var getuser = function(email){
	return new Promise(function(resolve, reject){
		var users = db.collection('users');
		var res = users.find({"email": email}).limit(1);
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

var createuser = function(email, pass, fullname) {
	var users = db.collection('users');
	var salt = randomstring.generate();
	var kdf = scrypt.kdfSync(pass, {"N": 1024, "r":8, "p":16}, 64, salt);
	var res = users.insert({
		email: email,
		pass: kdf,
		isadmin: false,
		fullname: fullname,
		bookcount: 0,
		books: []
	});
	db.close();
	return res;
};

var updateuser = function(email, pass, fullname) {
	var users = db.collection('users');
	if(pass){
		var salt = randomstring.generate();
		var kdf = scrypt.kdfSync(pass, {"N": 1024, "r":8, "p":16}, 64, salt);
		var res = users.update(
			{ email: email}, 
			{$set: { pass: kdf,
			  fullname: fullname
			}}
		);
		db.close();
		return res;
	}
	else {
		var res = users.update(
			{ email: email}, 
			{$set: { fullname: fullname}}
		);
		db.close();
		return res;
	}
};

var addbook = function(email, bookid){
	var users = db.collection('users');
	var res = users.update({email: email}, {$push: {books: bookid}, $inc: {bookcount: 1}});
	db.close()
	return res;
};

var removebook = function(email, bookid){
	var users = db.collection('users');
	var res = users.update({email: email}, {$pull: {books: bookid}, $inc: {bookcount: -1}});
	db.close()
	return res;
};

module.exports = {
	getuser: getuser,
	createuser: createuser,
	updateuser: updateuser,
	addbook: addbook,
	removebook: removebook
};

process.on('SIGINT', function() {
    console.log('Recieve SIGINT');
    db.close(function(){
        console.log('database connection has been closed.');
        process.exit();
    });
});