const request = require('request-promise');
const hash = require('crypto-js/hmac-sha256');

let get_url = (url)=>{
	let url_data = new URL(url);

	let list_key = [];
	for (const [key, value] of url_data.searchParams) {
		list_key.push(key)
	};
	let full_path = url.replace('https://api.lazada.vn/rest','');
	let path_request = full_path.split('?')[0];
	let path_function = full_path.split('?')[1].split('&').map(e=>e.split('=')[0]+'='+encodeURIComponent(e.split('=')[1])).join('&');
	
	let params = list_key.map(key=>key+url_data.searchParams.get(key)).sort().join('');

	let code_sha256  = hash(path_request+params,'0fnKxn5IIrddrLa9CiMhKrgczbi7VbBD').toString().toUpperCase();
	
	
	return url_data.origin+url_data.pathname+url_data.search+'&sign='+code_sha256;

};
module.exports = async (category_id,token)=>{
	let options = {
		url:get_url('https://api.lazada.vn/rest/category/attributes/get?primary_category_id='+category_id+'&app_key=119201&sign_method=sha256&timestamp='+Date.now()+'&access_token='+token),
		method:'GET',
		headers:{
			'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72'
		},
		rejectUnauthorized:false
	};
	
	let responseText = await request(options);
	
	let {data,message} = JSON.parse(responseText);
	
	if(message) throw message;
	return data;
};