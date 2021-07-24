const request = require('request-promise');
const hash = require('crypto-js/hmac-sha256');

let get_url = (url)=>{
	let full_path = url.replace('https://api.lazada.vn/rest','');
	let path_request = full_path.split('?')[0];
	let path_function = full_path.split('?')[1].split('&').map(e=>e.split('=')[0]+'='+encodeURIComponent(e.split('=')[1])).join('&');
	let params = full_path.split('?')[1].split('&').filter(e=>!e.includes('sign=')).map(e=>e.replace('=','')).sort().join('');	
	let code_sha256  = hash(path_request+params,'0fnKxn5IIrddrLa9CiMhKrgczbi7VbBD').toString().toUpperCase();
	
	return 'https://api.lazada.vn/rest'+path_request+'?'+path_function+'&sign='+code_sha256;
};
let make = async function(id_user,accountec_id,token,page = 1){

	let options = {
		url:get_url('https://api.lazada.vn/rest/products/get?create_after=2011-01-01T00:00:00+0800&limit=50&offset='+(50*(page-1))+'&app_key=119201&sign_method=sha256&timestamp='+Date.now()+'&access_token='+token),
		method:'GET',
		headers:{
			'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72'
		},
		rejectUnauthorized:false
	};
	
	
	let responseText = await request(options);
	
	let {data} = JSON.parse(responseText);
	if(!data.products) return [];
	
	let result_data = data.products.map(e=>{
		
		let {item_id,skus,attributes} = e;
		let {SellerSku,Images,special_price,price,quantity,Url,Status,special_to_date} = skus[0];
		let price_main = !special_to_date ? special_price : ((new Date(special_to_date.replace(/-/g,'.')).getTime()/1000) - Date.now()/1000 > 0 ? special_price : price)
		let {name} = attributes;
		return {
			product_id:item_id.toString(),
			sku:SellerSku.toString(),
			name,
			image:Images[0],
			price:price_main,
			quantity:parseInt(quantity) || 0,
			active:Status === 'active',
			url:Url,
			ec:'lazada'
		}
	});
	if(page === 1) await Product.destroy({id_user,accountec_id,ec:'lazada'});
	for(let obj of result_data){
		await Product.create({...obj,id_user,accountec_id});
	}
	
	if(result_data.length > 0){
		page+=1;
		return await make(id_user,accountec_id,token,page)
	}else{
		return;
	}
};

module.exports = make;