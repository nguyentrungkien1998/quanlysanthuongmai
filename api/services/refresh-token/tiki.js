const request = require('request-promise');
const info = require('../ec/ecommerce/tiki');

module.exports = async (refresh_token_old)=>{
	
	let options = {
		url:'https://api.tiki.vn/sc/oauth2/token',
		method:'POST',
		headers:{
			'Content-Type': 'application/x-www-form-urlencoded',
			'Accept': 'application/json',
			'Authorization':'Basic NTI5OTYyNzIwMTc1MjA4NDpnMWJYZFNTUWUzbVNPcFlZZUhzRkMtc3pLTG5YdGo1ag=='
		},
		rejectUnauthorized:false,
		form:{
			grant_type:'refresh_token',
			refresh_token:refresh_token_old,
			client_id:'5299627201752084'
		}
	};
	let responseText = await request(options);
	
	let {error,error_description,access_token,refresh_token} = JSON.parse(responseText);
	access_token = 'Bearer '+access_token;
	if(error) throw error_description;
	let info_data = await info(access_token);
	return {...info_data,access_token,refresh_token};
	
	
	
};