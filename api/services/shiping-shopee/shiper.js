const request = require('request-promise');
const sha256 = require('js-sha256');
module.exports = async (token)=>{
	let options = {
		url:'https://partner.shopeemobile.com/api/v1/logistics/channel/get',
		method:'POST',
		headers:{
		    'Content-Type': 'application/json'
		},
		rejectUnauthorized:false,
		body:JSON.stringify({
			"partner_id":845907,
			"shopid":parseInt(token),
			"timestamp":parseInt(Date.now()/1000)
		})
	};
	options.headers.Authorization = sha256.hmac('bVjs9TTxKo4f0cLNOZsX6pQlChBvfXNWw5ITE72ZjNr8uXnRfw5UQVKiNTV6xIgM',options.url+'|'+options.body);
	let responsText = await request(options);
	let {logistics} = JSON.parse(responsText);
	return logistics;
};