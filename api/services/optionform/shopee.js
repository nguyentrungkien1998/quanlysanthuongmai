const request = require('request-promise');
const sha256 = require('js-sha256');
module.exports = async (category_id,token)=>{
	let options = {
		method: 'POST',
		url: 'https://partner.shopeemobile.com/api/v1/item/attributes/get',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"category_id":parseInt(category_id),
			"partner_id":845907,
			"shopid":parseInt(token),
			"timestamp":parseInt(Date.now()/1000)
		})

	};
	
	
	options.headers.Authorization = sha256.hmac('bVjs9TTxKo4f0cLNOZsX6pQlChBvfXNWw5ITE72ZjNr8uXnRfw5UQVKiNTV6xIgM',options.url+'|'+options.body);
	let responseText = await request(options);
	
	let {attributes} = JSON.parse(responseText);
	return attributes || [];
};