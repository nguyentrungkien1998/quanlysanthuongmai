const request = require('request-promise');
module.exports = async (id,token)=>{
	let options = {
		url:'https://sapi.sendo.vn/shop/v2/category/'+id+'/attribute',
		method:'GET',
		headers:{
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'authorization':token,
			'Cache-Control': 'no-cache'
		},
		rejectUnauthorized:false
	};
	let responseText = await request(options);
	let {result:{attribute}} = JSON.parse(responseText);
	return attribute;
};