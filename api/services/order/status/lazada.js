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
let Cancel = async (order_item_id,token,reason_id = 15)=>{
	let options = {
		url:get_url('https://api.lazada.vn/rest/order/cancel?reason_id='+reason_id+'&order_item_id='+order_item_id+'&app_key=119201&sign_method=sha256&timestamp='+Date.now()+'&access_token='+token),
		method:'POST',
		headers:{
			'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72'
		},
		rejectUnauthorized:false
	};
	
	let responseText = await request(options);
	let {success} = JSON.parse(responseText);
	return success || false;
};
let Packed = async (shipping_provider,delivery_type,order_item_ids,token)=>{
	let options = {
		url:get_url('https://api.lazada.vn/rest/order/rts?shipping_provider='+shipping_provider+'&delivery_type='+delivery_type+'&order_item_ids='+JSON.stringify(order_item_ids)+'&app_key=119201&sign_method=sha256&timestamp='+Date.now()+'&access_token='+token),
		method:'POST',
		headers:{
			'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72'
		},
		rejectUnauthorized:false
	};
	
	let responseText = await request(options);
	let {data} = JSON.parse(responseText);
	return data ? data.order_items : false;
};
let ReadyToShip = async (shipment_provider,delivery_type,order_item_ids,tracking_number,token)=>{
	let options = {
		url:get_url('https://api.lazada.vn/rest/order/rts?shipping_provider='+shipping_provider+'&delivery_type='+delivery_type+'&order_item_ids='+JSON.stringify(order_item_ids)+'&tracking_number='+tracking_number+'&app_key=119201&sign_method=sha256&timestamp='+Date.now()+'&access_token='+token),
		method:'POST',
		headers:{
			'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72'
		},
		rejectUnauthorized:false
	};
	
	let responseText = await request(options);
	let {data} = JSON.parse(responseText);
	return data ? data.order_items : false;
};
let Delivered = async (order_item_ids,token)=>{
	let options = {
		url:get_url('https://api.lazada.vn/rest/order/sof/delivered?order_item_ids='+JSON.stringify(order_item_ids)+'&app_key=119201&sign_method=sha256&timestamp='+Date.now()+'&access_token='+token),
		method:'POST',
		headers:{
			'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72'
		},
		rejectUnauthorized:false
	};
	
	let responseText = await request(options);
	let {data} = JSON.parse(responseText);
	return data ? data.order_items : false;
};
let FailedDelivery = async (order_item_ids,token)=>{
	let options = {
		url:get_url('https://api.lazada.vn/rest/order/sof/failed_delivery?order_item_ids='+JSON.stringify(order_item_ids)+'&app_key=119201&sign_method=sha256&timestamp='+Date.now()+'&access_token='+token),
		method:'POST',
		headers:{
			'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72'
		},
		rejectUnauthorized:false
	};
	
	let responseText = await request(options);
	let {data} = JSON.parse(responseText);
	return data ? data.order_items : false;
};


module.exports = {Cancel,Packed,ReadyToShip,Delivered,FailedDelivery}


