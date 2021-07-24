const request = require('request-promise');

module.exports = async (product_id,price,token)=>{
	try{
		let options = {
			url:'https://api.tiki.vn/integration/v1/products/updateSku',
			method:'POST',
			headers:{
				'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72',
				'Authorization':token,
				'content-type':'application/json'
			},
			rejectUnauthorized:false,
			body:JSON.stringify({
				product_id:parseInt(product_id),
				price:parseInt(price)
			})
		};
		let responseText = await request(options);
		let {state} = JSON.parse(responseText);
		return
	}catch(error){
		let list_error = JSON.parse(error.response.body).errors;
		throw list_error.length > 0 ? JSON.parse(list_error[0]).error.message : 'Lỗi không xác định';
	}
};
