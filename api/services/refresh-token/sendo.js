const request = require('request-promise');
const info = require('../ec/ecommerce/sendo');
module.exports = async (shop_key,secret_key)=>{
	try{
		let options = {
			url:'https://open.sendo.vn/login',
			method:'POST',
			headers:{
				'Content-Type': 'application/json'
			},
			rejectUnauthorized:false,
			body:JSON.stringify({
				shop_key,
				secret_key
			})
		};
		let responseText = await request(options);
		let {result:{token}} = JSON.parse(responseText);
		token = 'Bearer '+token;

		let data = await info(token);
		
		return {token,...data};
	}catch(error){
		let {error:{message}}  = JSON.parse(error.response.body);
		return {error:message}

	}
};