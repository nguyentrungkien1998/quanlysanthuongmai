const request = require('request-promise');
const hash = require('crypto-js/hmac-sha256');
const info = require('../ec/ecommerce/lazada');
let get_url = (url)=>{
	let full_path = url.replace('https://auth.lazada.com/rest','');
	let path_request = full_path.split('?')[0];
	let path_function = full_path.split('?')[1].split('&').map(e=>e.split('=')[0]+'='+encodeURIComponent(e.split('=')[1])).join('&');
	let params = full_path.split('?')[1].split('&').filter(e=>!e.includes('sign=')).map(e=>e.replace('=','')).sort().join('');	
	let code_sha256  = hash(path_request+params,'0fnKxn5IIrddrLa9CiMhKrgczbi7VbBD').toString().toUpperCase();
	
	return 'https://auth.lazada.com/rest'+path_request+'?'+path_function+'&sign='+code_sha256;
};
module.exports = async (refresh_token_old)=>{
	let options = {
		url:get_url('https://auth.lazada.com/rest/auth/token/refresh?refresh_token='+refresh_token_old+'&app_key=119201&sign_method=sha256&timestamp='+Date.now()),
		method:'GET',
		headers:{
		    'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72'
		},
		rejectUnauthorized:false,
	};
	let responseText = await request(options);
	let {access_token,refresh_token} = JSON.parse(responseText);
	let info_data = await info(access_token);
	return {...info_data,access_token,refresh_token}
};