const request = require('request-promise');
const sha256 = require('js-sha256');
let update_variantion = async (data,token)=>{
	console.log(data);
	let options = {
		url:'https://partner.shopeemobile.com/api/v1/item/tier_var/init',
		method:'POST',
		headers:{
			'Content-Type': 'application/json'
		},
		body:JSON.stringify({
			...data,
			"partner_id":845907,
			"shopid":parseInt(token),
			"timestamp":parseInt(Date.now()/1000)
		})
	};
	options.headers.Authorization = sha256.hmac('bVjs9TTxKo4f0cLNOZsX6pQlChBvfXNWw5ITE72ZjNr8uXnRfw5UQVKiNTV6xIgM',options.url+'|'+options.body);
	let responseText = await request(options);
	let responseJson = JSON.parse(responseText);
	
	return responseJson;
};
module.exports = async (token,data)=>{

	let variation = {variation:data.variation,tier_variation:data.tier_variation};
	delete data.variations;
	let options = {
		method: 'POST',
		url: 'https://partner.shopeemobile.com/api/v1/item/add',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			...data,
			"partner_id":845907,
			"shopid":parseInt(token),
			"timestamp":parseInt(Date.now()/1000)
		})

	};
	
	options.headers.Authorization = sha256.hmac('bVjs9TTxKo4f0cLNOZsX6pQlChBvfXNWw5ITE72ZjNr8uXnRfw5UQVKiNTV6xIgM',options.url+'|'+options.body);
	
	let responseText = await request(options);
	let {error,msg,item_id} = JSON.parse(responseText);
	if(error) throw msg;
	return await update_variantion({...variation,item_id},token);
};