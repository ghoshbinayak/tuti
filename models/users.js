'usersse strict'
var config = require('../options');
var db = require('mongoskin').db(config.dbConfig.connURL);
var	scrypt = require('scrypt');
var	randomstring = require('randomstring');

var get = function(email){
	return new Promise(function(resolve, reject){
		var users = db.collection('users');
		var res = users.find({"email": email}).limit(1);
		res.toArray(function(err, arr){
			if(!err){
				resolve(arr[0]);
			}
			else{
				reject(err);
			}
			db.close();
		});
	});
};

var create = function(email, pass, fullname) {
	return new Promise(function(resolve, reject){
		var users = db.collection('users');
		var salt = randomstring.generate();
		var kdf = scrypt.kdfSync(pass, {"N": 1024, "r":8, "p":16}, 64, salt);
		var user  = {email: email,
					pass: kdf,
					isadmin: false,
					fullname: fullname};
		users.insert(user, function(err, doc){
			if(!err){
				resolve(doc.ops[0]);
			}
			else{
				reject(err);
			}
			db.close();
		});
	});
};

// var update = function(email, pass, fullname) {
// 	var users = db.collection('users');
// 	if(pass){
// 		var salt = randomstring.generate();
// 		var kdf = scrypt.kdfSync(pass, {"N": 1024, "r":8, "p":16}, 64, salt);
// 		var res = users.update(
// 			{ email: email}, 
// 			{$set: { pass: kdf,
// 			  fullname: fullname
// 			}}
// 		);
// 		db.close();
// 		return res;
// 	}
// 	else {
// 		var res = users.update(
// 			{ email: email}, 
// 			{$set: { fullname: fullname}}
// 		);
// 		db.close();
// 		return res;
// 	}
// };

module.exports = {
	get: get,
	create: create
	// update: update
};

process.on('SIGINT', function() {
    console.log('Recieve SIGINT');
    db.close(function(){
        console.log('database connection has been closed.');
        process.exit();
    });
});