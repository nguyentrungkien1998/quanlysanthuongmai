
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
let update_price_not_discount = async (authorization,product_id,info_data,price_new)=>{
	
	let variants = info_data.variants.map(e=>{
		e.variant_special_price =  null;
		e.variant_promotion_start_date = null;
		e.variant_promotion_end_date = null;
		e.variant_price = price_new
		delete e.variant_is_flash_sales;
		delete e.variant_campaign_status;
		delete e.variant_is_promotion;
		return e;
	})
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
				product_id,
				"price": price_new,
				"stock_quantity": info_data.stock_quantity,
				"is_config_variant": true,
				"stock_availability": true,
				"special_price": null,
				"promotion_start_date": null,
				"promotion_end_date": null,
				variants
			}]
			)
	};
	
	let responseText = await request(options);
	let {result:{error_list}} = JSON.parse(responseText);
	return error_list.length > 0
};
let update_price_discount = async (authorization,product_id,info_data,price_new)=>{
	let variants = info_data.variants.map(e=>{
		e.variant_special_price = price_new;
		e.variant_promotion_start_date = new Date();
		e.variant_promotion_end_date = new Date(Date.now()+2592000000)
		delete e.variant_is_flash_sales;
		delete e.variant_campaign_status;
		delete e.variant_is_promotion;
		return e;
	})
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
				product_id,
				"price": price_new,
				"stock_quantity": info_data.stock_quantity,
				"is_config_variant": true,
				"stock_availability": true,
				"special_price": null,
				"promotion_start_date": null,
				"promotion_end_date": null,
				variants
			}]
			)
	};
	
	let responseText = await request(options);
	let {result:{error_list}} = JSON.parse(responseText);
	return error_list.length > 0
};
module.exports = async (item_id,price,token)=>{
	if(price < 1000) throw 'Giá mới của sản phẩm tối thiểu không được nhỏ hơn 1000.'
	let info_data = await info(token,item_id);
	if((info_data.special_price > 0) && (info_data.price > price)){
		await update_price_not_discount(token,item_id,info_data,info_data.price);
		await update_price_discount(token,item_id,info_data,price);
	}else if((info_data.special_price > 0) && (info_data.price < price)){
		await update_price_not_discount(token,item_id,info_data,info_data.price);
		await update_price_not_discount(token,item_id,info_data,price);
	}else{
		await update_price_not_discount(token,item_id,info_data,price);
	};
	return true;
};





