const request = require('request-promise');
const sha256 = require('js-sha256');
let info = async (ordersn_list = [],shopid)=>{
	if(!shopid || (ordersn_list.length === 0)) return [];
	let options = {
		method: 'POST',
		url: 'https://partner.shopeemobile.com/api/v1/orders/detail',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			ordersn_list,
			"partner_id":845907,
			"shopid":parseInt(shopid),
			"timestamp":parseInt(Date.now()/1000)
		})

	};
	
	options.headers.Authorization = sha256.hmac('bVjs9TTxKo4f0cLNOZsX6pQlChBvfXNWw5ITE72ZjNr8uXnRfw5UQVKiNTV6xIgM',options.url+'|'+options.body);
	
	let responseText = await request(options);
	
	let {orders} = JSON.parse(responseText);
	
	return orders.map(e=>{
		return {
			time:parseInt(e.create_time)*1000,
			order_id:e.ordersn,
			name:e.recipient_address.name,
			address:e.recipient_address.full_address,
			phone:e.recipient_address.phone,
			items:e.items.map(i=>({product_id:i.item_id,product_name:i.item_name,quantity:i.variation_quantity_purchased})),
			price:parseInt(e.total_amount),
			payment_fee:parseInt(e.estimated_shipping_fee),
			payment_method:e.cod ? 'COD': e.payment_method,
			status:e.order_status,
			ec:'shopee'
		}
	});
};
let list = async (shopid,page = 1,result = [])=>{
	let options = {
		method: 'POST',
		url: 'https://partner.shopeemobile.com/api/v1/orders/get',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"order_status":'ALL',
			"pagination_offset":(page-1)*100,
			"pagination_entries_per_page":100,
			"partner_id":845907,
			"shopid":parseInt(shopid),
			"timestamp":parseInt(Date.now()/1000)
		})

	};
	
	options.headers.Authorization = sha256.hmac('bVjs9TTxKo4f0cLNOZsX6pQlChBvfXNWw5ITE72ZjNr8uXnRfw5UQVKiNTV6xIgM',options.url+'|'+options.body);
	
	let responseText = await request(options);
	let {orders} = JSON.parse(responseText);

	if(orders.length > 0){
		result = result.concat(orders);
		return await list(shopid,page += 1,result)
	}else{
		return result;
	}
};
module.exports = async function(shopid,accountec_id,id_user){

	let list_data = await list(shopid);
	let list_ordersn = list_data.map(({ordersn})=>ordersn);
	let list_order = await info(list_ordersn,shopid)
	await Order.destroy({accountec_id,id_user});
	for(let item of list_order){
		await Order.create({...item,accountec_id,id_user})
	};
	return

};