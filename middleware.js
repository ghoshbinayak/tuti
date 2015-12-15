var users = require('./models/users');

var requireLogin = function(req, res, next){
	if (!req.user) {
		res.redirect('/login');
	}
	else{
		next();
	}
}

var ifAdmin = function(req, res, next){
	if(req.user.isadmin){
		next();
	}
	else{
		res.render('admin/home', {message: "Sorry you don't have admin access. :( "});
	}
}

module.exports = {
	requireLogin: requireLogin,
	ifAdmin: ifAdmin
};
