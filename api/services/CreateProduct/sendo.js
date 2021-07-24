const request = require('request-promise');
module.exports = async (token,data)=>{
	try{
		let options = {
			url:'https://open.sendo.vn/api/partner/product',
			method:'POST',
			headers:{
				'content-type': 'application/json',
				'Authorization':token
			},
			rejectUnauthorized:false,
			body:JSON.stringify(data)
		};
		let responseText = await request(options);
		return JSON.parse(responseText);
	}catch(error){

		throw JSON.parse(error.response.body).error.message
	}
};