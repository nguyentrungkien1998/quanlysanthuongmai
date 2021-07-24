const request = require('request-promise');
let confirm = async (order_number,token)=>{
	try{
		let options = { 
			url: 'https://open.sendo.vn/api/partner/salesorder',
			method: 'PUT',
			headers:{ 
				Authorization:token,
				'cache-control': 'no-cache',
				'Content-Type': 'application/json' 
			},
			rejectUnauthorized: false,
			body:JSON.stringify({order_number,order_status:3,cancel_order_reason:null})
		}
		let responseText = await request(options);
		let {result} = JSON.parse(responseText);
		return result;

	}catch(error){
		return JSON.parse(error.response.body);
	}
	

};
module.exports = {confirm}