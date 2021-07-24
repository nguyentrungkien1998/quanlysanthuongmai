const request = require('request-promise');
module.exports = async (token)=>{
	try{
		let options = {
			url:'https://open.sendo.vn/api/partner/product/search',
			method:'POST',
			headers:{
				'authorization':token,
				'Content-Type': 'application/json',
				'cache-control': 'no-cache'

			},
			rejectUnauthorized:false,
			body:JSON.stringify({
				"page_size": 10,
				"product_name": "",
				"date_from": "2012-05-01",
				"date_to": "3010-05-28",
				"token": ""
			})
		};
		let responseText = await request(options);
		let {result:{data}} = JSON.parse(responseText);
		if(data.length === 0) return {name:'Empty'};
		return {name:data[0].store_name};
	}catch(error){
		let {error:{message}} = JSON.parse(error.response.body);
		return {error:message}
	}
	
};