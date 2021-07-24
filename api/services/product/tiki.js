const request = require('request-promise');
let get_stock = async (product_id,token)=>{
	let options = {
		url:'https://api.tiki.vn/integration/v1/products/'+product_id,
		method:'GET',
		headers:{
			'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72',
			'Authorization':token
		},
		rejectUnauthorized:false
	};
	let responseText = await request(options);
	let {inventory:{quantity_sellable}} = JSON.parse(responseText);
	return parseInt(quantity_sellable);
};
let make = async function(id_user,accountec_id,token,page = 1){
	
	let options = {
		url:'https://api.tiki.vn/integration/v1/products?page='+page+'&limit=50',
		method:'GET',
		headers:{
			'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72',
			'Authorization':token
		},
		rejectUnauthorized:false
	};
	
	let responseText = await request(options);

	let {data} = JSON.parse(responseText);
	let result_data_map =  data.map(async e=>{
		
		let {product_id,sku,name,thumbnail,created_at,price,quantity,market_price,active} = e;
		
		return {
			product_id:product_id.toString(),
			sku:sku.toString(),
			name,
			image:thumbnail,
			price:price || 0,
			quantity:await get_stock(product_id,token),
			active:active === 1,
			url:'https://tiki.vn/p'+product_id+'.html',
			ec:'tiki'
		}
	});	
	let result_data = await Promise.all(result_data_map);
	if(page === 1) await Product.destroy({id_user,accountec_id,ec:'tiki'});
	for(let obj of result_data){
		await Product.create({...obj,id_user,accountec_id});
	}
	if(result_data.length > 0){
		page+=1;
		return await make(id_user,accountec_id,token,page);
	}else{
		return ;
	}
};
module.exports = make;