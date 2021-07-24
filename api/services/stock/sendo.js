
const request = require('request-promise');
const info = async (authorization,product_id)=>{
	let options = {
		url:'https://open.sendo.vn/api/partner/product?id='+product_id,
		method:'GET',
		headers:{
			authorization
		}
	};
	let responseText = await request(options);
	let {result} = JSON.parse(responseText);

	return result;
}
let update_stock = async (authorization,info_data,stock)=>{
	
	let variants = info_data.variants.map(e=>{
		e.variant_quantity = stock;
		e.variant_promotion_start_date = new Date(e.variant_promotion_start_date_timestamp*1000);
		e.variant_promotion_end_date = new Date(e.variant_promotion_end_date_timestamp*1000);
		delete e.variant_promotion_start_date_timestamp;
		delete e.variant_promotion_end_date_timestamp;
		delete e.variant_is_flash_sales;
		delete e.variant_campaign_status;
		delete e.variant_is_promotion;
		return e;
	});
	let options = {
		url:'https://open.sendo.vn/api/partner/product/config/variant-price',
		method:'PUT',
		headers:{
			'Content-Type': 'application/json',
			authorization
		},
		rejectUnauthorized:false,
		body:JSON.stringify(
			[{
				product_id:info_data.id,
				"price": info_data.price,
				"stock_quantity": stock,
				"is_config_variant": info_data.is_config_variant,
				"stock_availability": info_data.stock_availability,
				"special_price": info_data.special_price,
				
				variants
			}]
		)
	};
	
	
	let responseText = await request(options);
	
	let {result:{error_list}} = JSON.parse(responseText);
	
	return error_list.length > 0
};

module.exports = async (item_id,stock,token)=>{
	
	let info_data = await info(token,item_id);

	await update_stock(token,info_data,stock);
	
	return true;
};





