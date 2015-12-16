var express = require('express');
var router = express.Router();
var	products = require('../models/products');

router.post('/add', function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var des = req.body.description;
	var photos = req.body.photos;
	var product = products.add(name, des, price, photos);
	product.then(function(result){
		res.json({success: {message: 'Product added',
							productID: result}});		
	}).catch(function(err){
		res.status(400).json({err: {message: err.toString(),
						type: 'DB error'}});
	});
});

router.get('/info', function(req, res){
	var id = req.query.id;
	products.get(id).then(function(result){
		res.json({success: {message: 'Product found',
					product: result}});				
	}).catch(function(err){
		res.status(400).json({err: {message: err.toString(),
						type: 'DB error'}});		
	});
});

router.put('/update', function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var des = req.body.description;
	var photos = req.body.photos;
	var id = req.body.id;
	var product = products.update(id, name, des, price, photos);
	product.then(function(result){
		res.json({success: {message: 'Product updated',
						    productID: id}});

	}).catch(function(err){
		res.status(400).json({err: {message: err.toString(),
						type: 'DB error'}});		
	});
});

router.get('/list', function(req, res){
	var page = req.query.page;
	if(!page){
		page = 1;
	}
	products.list(page).then(function(result){
		res.json(result);
	}).catch(function(err){
		res.status(400).json({error: {message: err.toString(),
						  type: 'DB error'}});
	});
});

router.delete('/', function(req, res){
	var id = req.query.id;
	products.del(id).then(function(result){
		res.json({success: {message: "Deleted product",
							count: result}});
	}).catch(function(err){
		res.status(400).json({error: {message: err.toString(),
						  type: 'DB error'}});
	});
});

module.exports = router;