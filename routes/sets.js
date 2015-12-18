var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();
var	products = require('../models/products');
var sets = require('../models/sets');
var config = require('../options');


router.post('/new', jwt({secret: config.dbConfig.jwtSecret}), function(req, res){
	var name = req.body.name;
	var des = req.body.description;
	var photos = req.body.photos;
	var range = {min: req.body.min, max: req.body.max};
	var set = sets.create(name, des, range, photos);
	set.then(function(result){
		res.json({success: {message: 'Set created',
							setID: result}});		
	}).catch(function(err){
		res.status(400).json({error: {message: err.toString(),
						type: 'DBerror'}});
	});
});

router.get('/info', function(req, res){
	var id = req.query.id;
	sets.get(id).then(function(result){
		if (result) {
			res.json({success: {message: 'Set found',
						set: result}});							
		}
		else{
			res.status(404).json({error: {message: "Set not found",
				type: 'resourceNotFound'}});					
		}
	}).catch(function(err){
		res.status(400).json({error: {message: err.toString(),
						type: 'DBerror'}});		
	});
});

router.put('/add', jwt({secret: config.dbConfig.jwtSecret}), function(req, res){
	var sid = req.body.sid;
	var pid = req.body.pid;
	sets.add(sid, pid).then(function(result){
		res.json({success: {message: 'Product added.',
							setID: sid,
							productID: pid}});
	}).catch(function(err){
		if(typeof(err) == 'string'){
			res.status(400).json({error: {message: err,
										type: 'resourceNotFound'}});
		}
		else{
			res.status(400).json({error: {message: err.toString(),
										type: 'DBerror'}});			
		}
	});
});

router.delete('/remove', jwt({secret: config.dbConfig.jwtSecret}), function(req, res){
	var sid = req.body.sid;
	var pid = req.body.pid;
	sets.remove(sid, pid).then(function(result){
		res.json({success: {message: 'Successfully removed product from set.',
							count: result.nModified}});
	}).catch(function(err){
		res.status(400).json({error: {message: err.toString(),
									  type: 'DBerror'}});
	});
});

router.delete('/del', jwt({secret: config.dbConfig.jwtSecret}), function(req, res){
	var sid = req.query.id;
	sets.del(sid).then(function(result){
		res.json({success: {message: 'Set deleted.',
							count: result.n}});
	}).catch(function(err){
		res.status(400).json({error: {message: err.toString(),
									  type: 'DBerror'}});
	});
});

router.put('/update', jwt({secret: config.dbConfig.jwtSecret}), function(req, res){
	var id = req.body.id;
	var name = req.body.name;
	var des = req.body.description;
	var range = {min: req.body.min, max: req.body.max};
	var photos = req.body.photos;
	var set = sets.update(id, name, des, range, photos);
	set.then(function(result){
		if(result.n === 0){
			res.status(404).json({error: {message: "Set not found",
									type: 'resourceNotFound'}});					
		}
		else{
			res.json({success: {message: 'Set updated',
							    setID: id}});
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
	sets.list(page).then(function(result){
		res.json(result);
	}).catch(function(err){
		res.status(400).json({error: {message: err.toString(),
						  type: 'DB error'}});
	});
});

module.exports = router;