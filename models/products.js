'use strict'
var db = require('mongoskin').db('mongodb://localhost:27017/test');
var ObjectId = require('mongodb').ObjectID;

var get = function(id){
	return new Promise(function(resolve, reject){
		var products = db.collection('products');
		var res = products.find({_id: ObjectId(id)}, {limit: 1});
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

var add = function(name, description, price, photos) {
	return new Promise(function(resolve, reject){
		var products = db.collection('products');
		var product =  {'name': name,
						'description': description,
						'price': price,
						'isPub': false,
						'photos': photos};
		products.insert(product, function(err, doc){
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

var update = function(id, name, description, price, photos){
	return new Promise(function(resolve, reject){
		var products = db.collection('products');
		var product =  {'name': name,
					'description': description,
					'price': price,
					'isPub': false,
					'photos': photos};
		products.update({_id: ObjectId(id)}, {$set: product}, function(err, result){
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

var list = function(page){
	return new Promise(function(resolve, reject){
		var products = db.collection('products');
		var list = products.find();
		list.count(function(err, count){
			if(!err){
				list.skip(10*(page-1)).limit(20).toArray(function(err, arr){
					if(!err){
						resolve({count: count, products: arr});
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
		var products = db.collection('products');
		products.remove({_id: ObjectId(id)}, function(err, result){
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

var publish = function(id) {
	return new Promise(function(resolve, reject){
		var products = db.collection('products');
		products.update({_id: ObjectId(id)}, {$set: {isPub: true}}, function(err, result){
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

var unpublish = function(id) {
	return new Promise(function(resolve, reject){
		var products = db.collection('products');
		products.update({_id: ObjectId(id)}, {$set: {isPub: false}}, function(err, result){
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


module.exports = {
	get: get,
	add: add,
	del: del,
	list: list,
	update: update,
	publish: publish,
	unpublish: unpublish
};

process.on('SIGINT', function() {
    console.log('Recieve SIGINT');
    db.close(function(){
        console.log('database connection has been closed.');
        process.exit();
    });
})