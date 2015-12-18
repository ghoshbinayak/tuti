'use strict'
var config = require('../options');
var db = require('mongoskin').db(config.dbConfig.connURL);
var ObjectId = require('mongodb').ObjectID;

var get = function(id){
	return new Promise(function(resolve, reject){
		var pages = db.collection('pages');
		var res = pages.find({_id: ObjectId(id)});
		res.toArray(function(err, arr){
			if(!err){
				resolve(arr[0]);
			}
			else{
				reject(err);
			}
		});
	});
}

var create = function(title, body){
	return new Promise(function(resolve, reject){
		var pages = db.collection('pages');
		var date = Date();
		var page = {title: title,
					body: body,
					lastmodified: date
				};
		pages.insert(page, function(err, doc){
			if(!err){
				resolve(doc.insertedIds[0]);
			}
			else{
				reject(err);
			}
			db.close();
		});
	});
}

var update = function(id, title, body){
	return new Promise(function(resolve, reject){
		var pages = db.collection('pages');
		pages.update({_id: ObjectId(id)},
					 {$set: {title: title, body: body},
					  $currentDate: {lastmodified: true}
					 },
					 function(err, result){
					 	if(!err){
					 		resolve(result.result);
					 	}
					 	else{
					 		reject(err);
					 	}
					 });		
	});
}

var del = function(id){
	return new Promise(function(resolve, reject){
		var pages = db.collection('pages');
		pages.remove({_id: ObjectId(id)}, function(err, result){
			if(!err){
				resolve(result.result);
			}
			else{
				reject(err);
			}
		});
	});
}

var list = function(page){
	return new Promise(function(resolve, reject){
		var pages = db.collection('pages');
		var list = pages.find();
		list.count(function(err, count){
			if(!err){
				list.skip(10*(page-1)).limit(20).toArray(function(err, arr){
					if(!err){
						resolve({count: count, pages: arr});
					}
					else{
						reject(err);
					}
					db.close();
				});
			}
			else{
				reject(err);
				db.close();
			}
		});
	});
};

module.exports = {
	create: create,
	get: get,
	list: list,
	update: update,
	del: del
};

process.on('SIGINT', function() {
    console.log('Recieve SIGINT');
    db.close(function(){
        console.log('database connection has been closed.');
        process.exit();
    });
})