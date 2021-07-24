const request = require('request-promise');
const sha256 = require('js-sha256');
module.exports = async (logistic_id,token,enabled = true)=>{
	let options = {
		url:'https://partner.shopeemobile.com/api/v1/logistics/channels/update',
		method:'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"enabled":enabled,
			"logistic_id":parseInt(logistic_id),
			"partner_id":845907,
			"shopid":parseInt(token),
			"timestamp":parseInt(Date.now()/1000)
		})
	};
	options.headers.Authorization = sha256.hmac('bVjs9TTxKo4f0cLNOZsX6pQlChBvfXNWw5ITE72ZjNr8uXnRfw5UQVKiNTV6xIgM',options.url+'|'+options.body);
	let responseText = await request(options);
	let data = JSON.parse(responseText);
	if(data.error) throw data.msg;
	return JSON.parse(responseText);
};