const request = require('request-promise');
const hash = require('crypto-js/hmac-sha256');
let get_url = (url)=>{
	let full_path = url.replace('https://api.lazada.vn/rest','');
	let path_request = full_path.split('?')[0];
	let path_function = full_path.split('?')[1].split('&').map(e=>e.split('=')[0]+'='+encodeURIComponent(e.split('=')[1])).join('&');
	let params = full_path.split('?')[1].split('&').filter(e=>!e.includes('sign=')).map(e=>e.replace('=','')).sort().join('');	
	let code_sha256  = hash(path_request+params,'0fnKxn5IIrddrLa9CiMhKrgczbi7VbBD').toString().toUpperCase();
	
	return 'https://api.lazada.vn/rest'+path_request+'?'+path_function+'&sign='+code_sha256;
};
let info_order = async (order_id,token)=>{
	let options = {
		url:get_url('https://api.lazada.vn/rest/order/items/get?order_id='+order_id+'&app_key=119201&sign_method=sha256&timestamp='+Date.now()+'&access_token='+token),
		method:'GET',
		headers:{
			'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72'	
		},
		rejectUnauthorized:false
	};
	let responseText = await request(options);
	let {data} = JSON.parse(responseText);
	let order_list =  data.map(({name,order_item_id,shop_sku})=>({product_id:shop_sku.split('_')[0],product_name:name}));
	let product_id_list = order_list.map(({product_id})=>product_id.toString());
	let count = {};
    product_id_list.forEach(function(i) { count[i] = (count[i]||0) + 1;});
	let order_filter_duplicate = Object.values(order_list.reduce((acc,cur)=>Object.assign(acc,{[cur.product_id]:cur}),{}));
	return order_filter_duplicate.map(e=>{
		e.quantity = count[e.product_id].toString();
		return e;
	})
};
let make = async (token,accountec_id,id_user,start = 0,end = Date.now(),page = 1)=>{
	let options = {
		url:get_url('https://api.lazada.vn/rest/orders/get?created_after='+(new Date(start)).toISOString()+'&create_before='+(new Date(end)).toISOString()+'&offset='+(50*(page-1))+'&limit=50&app_key=119201&sign_method=sha256&timestamp='+Date.now()+'&access_token='+token),
		method:'GET',
		headers:{
			'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72'
		},
		rejectUnauthorized:false
	};
	let responseText = await request(options);
	let {data:{orders}} = JSON.parse(responseText);
	let map_info = orders.map(async e=>{
		let {statuses,created_at,address_shipping:{first_name,address1,address5,address4,address3,phone},order_id,payment_method,shipping_fee,price} = e;
		return {
			time:new Date(created_at).getTime(),
			order_id:order_id.toString(),
			name:first_name.toString(),
			address:address1+','+address5+','+address4+','+address3,
			phone:phone.slice(0,3) === '840' ? '0'+phone.slice(3) : phone,
			items:await info_order(order_id,token),
			price:parseInt(price.replace('.00','')),
			payment_fee:parseInt(shipping_fee),
			payment_method:payment_method.toString(),
			status:statuses[0].toString(),
			ec:'lazada'
		}
	});
	let result_data = await Promise.all(map_info);


	if(page === 1) await Order.destroy({accountec_id,id_user});
	for(let item of result_data){
		await Order.create({...item,accountec_id,id_user})
	}




	if(result_data.length > 0){
		page+=1;
		return await make(token,accountec_id,id_user,start,end,page)
	}else{
		return;
	}
};

module.exports = make;