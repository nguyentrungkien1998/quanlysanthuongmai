const info = require('./ecommerce/tiki');
const request = require('request-promise');
let info_code = async (code)=>{
	
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
			grant_type:'authorization_code',
			code,
			redirect_uri:'https://seu.vn/dashboard/san-thuong-mai/tiki',
			client_id:'5299627201752084'
		}
	};
	let responseText = await request(options);

	let {access_token,refresh_token,token_type} = JSON.parse(responseText);
	access_token = 'Bearer '+ access_token;
	return {refresh_token,access_token};
	
	
};
module.exports = async function(code){
	let {access_token,refresh_token} = await info_code(code);
	let info_data = await info(access_token);
	return {...info_data,access_token,refresh_token};
};