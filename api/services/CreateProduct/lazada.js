const request = require('request-promise');
const hash = require('crypto-js/hmac-sha256');
let xml2js = require('xml2js');
let Entities = require('html-entities').AllHtmlEntities;

let entities = new Entities();
let parser = new xml2js.Parser();
let builder = new xml2js.Builder();
let get_url = (url)=>{
	let url_data = new URL(url);
	let list_key = [];
	
	for (const [key, value] of url_data.searchParams) {
		list_key.push(key)
	};
	
	let path_request = url_data.pathname.replace('rest/','');
	let params = list_key.map(key=>key+url_data.searchParams.get(key)).sort().join('');
	let code_sha256  = hash(path_request+params,'0fnKxn5IIrddrLa9CiMhKrgczbi7VbBD').toString().toUpperCase();
	let full_url = url_data.href.replace(/%20/g,'+')+'&sign='+code_sha256;
	
	return full_url.replace('https://api.lazada.vn/rest/product/create?','');
};
function fixedEncodeURIComponent(str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
		return '%' + c.charCodeAt(0).toString(16);
	});
};
module.exports = async (token,body)=>{
	
	body.Request.Product[0].Attributes[0].description[0] = entities.encode(body.Request.Product[0].Attributes[0].description[0]);
	
	let payload = await builder.buildObject(body);
	
	payload = payload.replace(/\n/g,'');


	let options = {
		url:'https://api.lazada.vn/rest/product/create',
		method:'POST',
		headers:{
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
		},
		rejectUnauthorized:false,
		body:get_url('https://api.lazada.vn/rest/product/create?payload='+fixedEncodeURIComponent(payload)+'&app_key=119201&sign_method=sha256&timestamp='+Date.now()+'&access_token='+token)
	};

	
	
	let responseText = await request(options);
	
	let {data,message,detail} = JSON.parse(responseText);
	if(detail) throw  detail[0].message;
	return data;
};