const request = require('request-promise');
const sha256 = require('js-sha256');
let Cancel = async (ordersn,cancel_reason,price,shopid)=>{
	let options = {
		url:'https://partner.shopeemobile.com/api/v1/orders/cancel',
		method:'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			ordersn,
			cancel_reason,
			shopid:parseInt(shopid),
			price:parseInt(price),
			"timestamp":parseInt(Date.now()/1000)
		}),
		rejectUnauthorized:false
	};
	options.headers.Authorization = sha256.hmac('bVjs9TTxKo4f0cLNOZsX6pQlChBvfXNWw5ITE72ZjNr8uXnRfw5UQVKiNTV6xIgM',options.url+'|'+options.body);
	let responseText = await request(options);
	let {modified_time,msg} = JSON.parse(responseText);
	if(msg) throw msg;
	return modified_time;
};
let AcceptBuyerCancellation = async (ordersn,shopid)=>{
	let options = {
		url:'https://partner.shopeemobile.com/api/v1/orders/buyer_cancellation/accept',
		method:'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			ordersn,
			shopid:parseInt(shopid),
			
			"timestamp":parseInt(Date.now()/1000)
		}),
		rejectUnauthorized:false
	};
	options.headers.Authorization = sha256.hmac('bVjs9TTxKo4f0cLNOZsX6pQlChBvfXNWw5ITE72ZjNr8uXnRfw5UQVKiNTV6xIgM',options.url+'|'+options.body);
	let responseText = await request(options);
	let {modified_time,msg} = JSON.parse(responseText);
	if(msg) throw msg;
	return modified_time;	
};
let RejectBuyerCancellation = async (ordersn,shopid)=>{
	let options = {
		url:'https://partner.shopeemobile.com/api/v1/orders/buyer_cancellation/reject',
		method:'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			ordersn,
			shopid:parseInt(shopid),
			price:parseInt(price),
			"timestamp":parseInt(Date.now()/1000)
		}),
		rejectUnauthorized:false
	};
	options.headers.Authorization = sha256.hmac('bVjs9TTxKo4f0cLNOZsX6pQlChBvfXNWw5ITE72ZjNr8uXnRfw5UQVKiNTV6xIgM',options.url+'|'+options.body);
	let responseText = await request(options);
	let {modified_time,msg} = JSON.parse(responseText);
	if(msg) throw msg;
	return modified_time;	
};
module.exports = {Cancel,AcceptBuyerCancellation,RejectBuyerCancellation}