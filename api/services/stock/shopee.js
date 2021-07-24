const request = require('request-promise');
const sha256 = require('js-sha256');
module.exports = async (item_id,stock,token)=>{
	let options = {
		url:'https://partner.shopeemobile.com/api/v1/items/update_stock',
		method:'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"partner_id":845907,
			shopid:parseInt(token),
			item_id:parseInt(item_id),
			stock:parseInt(stock),
			"timestamp":parseInt(Date.now()/1000)
		}),
		rejectUnauthorized:false
	};
	options.headers.Authorization = sha256.hmac('bVjs9TTxKo4f0cLNOZsX6pQlChBvfXNWw5ITE72ZjNr8uXnRfw5UQVKiNTV6xIgM',options.url+'|'+options.body);
	let responseText = await request(options);
	let {item,msg} = JSON.parse(responseText);
	if(msg) throw msg === 'Shop is under vacation mode' ? 'Shop đang tạm dừng hoạt động':msg;
	return item;
};