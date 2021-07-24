const request = require('request-promise');
module.exports = async (attribute_id,Authorization)=>{
	let options = {
		url:'https://open.sendo.vn/api/partner/category/attribute/'+attribute_id,
		method:'GET',
		headers:{
		    Authorization
		},
		rejectUnauthorized:false
	};
	let responseText = await request(options);
	let {result} = JSON.parse(responseText);
	return result.attribute;
};