const request = require('request-promise');
let make = async function(id_user,accountec_id,token,token_page = "",page = 1){
	let options = {
		url:'https://open.sendo.vn/api/partner/product/search',
		method:'POST',
		headers:{
			'authorization': token,
			'cache-control': 'no-cache',
			'Content-Type':'application/json' 
		},
		rejectUnauthorized:false,
		body:JSON.stringify({
			"page_size": 10,
			"product_name": "",
			"date_from": "2000-05-01",
			"date_to": "9999-07-08",
			"token": token_page
		})
	};
	
	let responseText = await request(options);
	let {result:{data,next_token}} = JSON.parse(responseText);
	
	let result_data =  data.map(e=>{
		
		let {id,name,image,sku,special_price,price,stock_quantity,link,stock,final_price_min} = e;
		return {
			product_id:id.toString(),
			sku:sku.toString(),
			name,
			image,
			price:final_price_min || special_price || price,
			quantity:stock_quantity || 0,
			active:stock,
			url:link,
			ec:'sendo'
		}
	});
	if(page === 1) await Product.destroy({id_user,accountec_id,ec:'sendo'});
	for(let obj of result_data){
		await Product.create({...obj,id_user,accountec_id});
	}
	if((result_data.length > 0 ) && next_token){
		page+=1;
		return await make(id_user,accountec_id,token,next_token,page);
	}else{
		return;
	}
};
module.exports = make;