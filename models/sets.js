'use strict'
var config = require('../options');
var db = require('mongoskin').db(config.dbConfig.connURL);
var ObjectId = require('mongodb').ObjectID;
var products = require('./products');

var get = function(id){
	return new Promise(function(resolve, reject){
		var sets = db.collection('sets');
		var res = sets.find({_id: ObjectId(id)}, {limit: 1});
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

var create = function(name, description, range, photos) {
	return new Promise(function(resolve, reject){
		var sets = db.collection('sets');
		var set =  {'name': name,
						'description': description,
						'range': range,
						'photos': photos,
						'products': []};
		sets.insert(set, function(err, doc){
			if(!err){
				resolve(doc.insertedIds[0]);
			}
			else{
				reject(err);
			}
			db.close();
		});
	});
};

var add = function(sid, pid) {
	return new Promise(function(resolve, reject){
		var product = products.get(pid);
		var set = get(sid);
		var sets = db.collection('sets');
		set.then(function(result){
			if(result){
				product.then(function(result2){
					if(result2){
						sets.update({_id: ObjectId(result._id)}, 
									{$addToSet: {products: result2._id}},
									function(err, result3){
										if(!err){
											resolve(result3);
										}
										else{
											reject(err);
										}
										db.close();
									});						
					}
					else{
						reject('Invalid product id');
					}
				}).catch(function(err){
					reject(err);
				});
			}
			else {
				reject("invalid set id");
			}
		}).catch(function(err){
			reject(err);
		});
	});
}


var remove = function(sid, pid){
	return new Promise(function(resolve, reject){
		var sets = db.collection('sets');
		sets.update({_id: ObjectId(sid)}, {$pull: {products: ObjectId(pid)}}, function(err, result){
			if(!err){
				console.log(result);
				resolve(result.result);
			}
			else{
				reject(err);
			}
		});
	});
}

var update = function(id, name, description, range, photos){
	return new Promise(function(resolve, reject){
		var sets = db.collection('sets');
		var set =  {'name': name,
					'description': description,
					'range': range,
					'photos': photos};
		sets.update({_id: ObjectId(id)}, {$set: set}, function(err, result){
			if(!err){
				resolve(result);
			}
			else{
				reject(err);
			}
			db.close();
		});
	});
};

var list = function(page){
	return new Promise(function(resolve, reject){
		var sets = db.collection('sets');
		var list = sets.find();
		list.count(function(err, count){
			if(!err){
				list.skip(10*(page-1)).limit(20).toArray(function(err, arr){
					if(!err){
						resolve({count: count, sets: arr});
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

var del = function(id) {
	return new Promise(function(resolve, reject){
		var sets = db.collection('sets');
		sets.remove({_id: ObjectId(id)}, function(err, result){
			if(!err){
				resolve(result.result);
			}
			else{
				reject(err);
			}
			db.close();
		});
	});
};

module.exports = {
	create: create,
	get: get,
	list: list,
	add: add,
	remove: remove,
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