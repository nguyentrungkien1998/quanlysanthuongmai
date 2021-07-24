const request = require('request-promise');
const sha256 = require('js-sha256');
module.exports =  async function(shopid){
	shopid = parseInt(shopid);
	let options = {
		method: 'POST',
		url: 'https://partner.shopeemobile.com/api/v1/shop/get',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"partner_id":845907,
			shopid,
			"timestamp":parseInt(Date.now()/1000)
		})
	};
	options.headers.Authorization = sha256.hmac('bVjs9TTxKo4f0cLNOZsX6pQlChBvfXNWw5ITE72ZjNr8uXnRfw5UQVKiNTV6xIgM',options.url+'|'+options.body);
	let responseText = await request(options);
	let {shop_name} = JSON.parse(responseText);
	return {name:shop_name}
}; 