'use strict';
var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();
var	products = require('../models/products');
var config = require('../options');


router.post('/add', jwt({secret: config.dbConfig.jwtSecret}), function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var des = req.body.description;
	var photos = req.body.photos;
	var product = products.add(name, des, price, photos);
	product.then(function(result){
		res.json({success: {message: 'Product added',
							productID: result}});		
	}).catch(function(err){
		res.status(400).json({error: {message: err.toString(),
						type: 'DBerror'}});
	});
});

router.get('/info/:id', function(req, res){
	var id = req.params.id;
	products.get(id).then(function(result){
		if(result){
			res.json({success: {message: 'Product found',
						product: result}});				
		}
		else{
			res.status(404).json({error: {message: "Product not found",
									type: 'resourceNotFound'}});					
		}
	}).catch(function(err){
		res.status(400).json({error: {message: err.toString(),
						type: 'DBerror'}});		
	});
});

router.put('/update', jwt({secret: config.dbConfig.jwtSecret}), function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var des = req.body.description;
	var photos = req.body.photos;
	var id = req.body.id;
	var product = products.update(id, name, des, price, photos);
	product.then(function(result){
		if(result.n === 0){
			res.status(404).json({error: {message: "Product not found",
									type: 'resourceNotFound'}});					
		}
		else{
			res.json({success: {message: 'Product updated',
							    productID: id}});
		}

	}).catch(function(err){
		res.status(400).json({error: {message: err.toString(),
						type: 'DBerror'}});		
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
						  type: 'DBerror'}});
	});
});

router.delete('/del/:id', jwt({secret: config.dbConfig.jwtSecret}), function(req, res){
	var id = req.params.id;
	products.del(id).then(function(result){
		res.json({success: {message: "Deleted product",
							count: result.n}});
	}).catch(function(err){
		res.status(400).json({error: {message: err.toString(),
						  type: 'DBerror'}});
	});
});

module.exports = router;