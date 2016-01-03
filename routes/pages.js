'use strict';
var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();
var	pages = require('../models/pages');
var config = require('../options');

router.post('/new', jwt({secret: config.dbConfig.jwtSecret}), function(req, res){
	var title = req.body.title;
	var body = req.body.body;
	var page = pages.create(title, body);
	page.then(function(result){
		res.json({success: {message: 'Page created',
							pageID: result}});		
	}).catch(function(err){
		res.status(400).json({error: {message: err.toString(),
						type: 'DBerror'}});
	});
});

router.get('/info/:id', function(req, res){
	var id = req.params.id;
	pages.get(id).then(function(result){
		if (result) {
			res.json({success: {message: 'Page found',
						page: result}});							
		}
		else{
			res.status(404).json({error: {message: "Page not found",
				type: 'resourceNotFound'}});					
		}
	}).catch(function(err){
		res.status(400).json({error: {message: err.toString(),
						type: 'DBerror'}});		
	});
});

router.delete('/del/:id', jwt({secret: config.dbConfig.jwtSecret}), function(req, res){
	var id = req.params.id;
	pages.del(id).then(function(result){
		res.json({success: {message: 'Page deleted.',
							count: result.n}});
	}).catch(function(err){
		res.status(400).json({error: {message: err.toString(),
									  type: 'DBerror'}});
	});
});

router.put('/update', jwt({secret: config.dbConfig.jwtSecret}), function(req, res){
	var id = req.body.id;
	var title = req.body.title;
	var body = req.body.body;
	var page = pages.update(id, title, body);
	page.then(function(result){
		if(result.n === 0){
			res.status(404).json({error: {message: "Page not found",
									type: 'resourceNotFound'}});					
		}
		else{
			res.json({success: {message: 'Page updated',
							    pageID: id}});
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
	pages.list(page).then(function(result){
		res.json(result);
	}).catch(function(err){
		res.status(400).json({error: {message: err.toString(),
						  type: 'DB error'}});
	});
});

module.exports = router;