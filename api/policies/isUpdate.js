const {code_update} = require('../../nuxt.config.js');
module.exports = async function isLoggedIn(req, res, next) {
	if(code_update === req.headers.code_update){
		return next();
	}else{
		return res.forbidden({error:'No access'});
	} 
};
