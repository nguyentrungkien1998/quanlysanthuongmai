const request = require('request-promise');
const hash = require('crypto-js/hmac-sha256');
let waitTime = time=>{
	return new Promise(resolve=>{
		setTimeout(function(){
			return resolve(time)
		},time)
	})
};
let get_url = (url)=>{
	let full_path = url.replace('https://api.lazada.vn/rest','');
	let path_request = full_path.split('?')[0];
	let path_function = full_path.split('?')[1].split('&').map(e=>e.split('=')[0]+'='+encodeURIComponent(e.split('=')[1])).join('&');
	let params = full_path.split('?')[1].split('&').filter(e=>!e.includes('sign=')).map(e=>e.replace('=','')).sort().join('');	
	let code_sha256  = hash(path_request+params,'0fnKxn5IIrddrLa9CiMhKrgczbi7VbBD').toString().toUpperCase();
	return 'https://api.lazada.vn/rest'+path_request+'?'+path_function+'&sign='+code_sha256;
};
let info = async (product_id,skuId,token)=>{
	let options = {
		url:get_url('https://api.lazada.vn/rest/product/item/get?item_id='+product_id+'&seller_sku='+skuId+'&app_key=119201&sign_method=sha256&timestamp='+Date.now()+'&access_token='+token),
		method:'GET',
		headers:{
			'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72'
		},
		rejectUnauthorized:false
	};
	let responseText = await request(options);
	
	let {data,message} = JSON.parse(responseText);
	
	if(message){
		if(message.includes('Api access frequency exceeds the limit. this ban will last 1 seconds')){
			await waitTime(5000);
			return await info(product_id,skuId,token);
		}else{
			throw message;
		}
	}
	
	if(!data.item_id){
		return await info(product_id,skuId,token)
	}else{
		return data.skus[0];
	}
};
let update = async (payload,token)=>{

	let options = {
		url:get_url('https://api.lazada.vn/rest/product/price_quantity/update?payload='+payload+'&app_key=119201&sign_method=sha256&timestamp='+Date.now()+'&access_token='+token),
		method:'POST',
		headers:{
			'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72'
		},
		rejectUnauthorized:false
	};
	let responseText = await request(options);
	
	let {message,detail} = JSON.parse(responseText);
	if(message) throw detail.length > 0 ? detail[0].message : message;
	return true;
};
let getDate = (unixtime)=>{
	let time = new Date(unixtime);
	let year = time.getFullYear();
	let month = time.getMonth()+1;
	let day = time.getDate();
	return year+'-'+(month.toString().length === 1 ? '0'+month : month)+'-'+day;
};
let make = async (product_id,price_new,token,skuId)=>{
	product_id = parseInt(product_id);
	price_new = parseInt(price_new);
	
	let result = await info(product_id,skuId,token);
	let {price,special_price,special_from_time,special_to_time,Available,SellerSku} = result;
	if(price_new >= price) throw 'Gi?? s???n ph???m kh??ng ???????c l???n h??n ho???c b???ng gi?? ni??m y???t';
	if((special_price === 0) && (price_new < price)){
		special_from_time = getDate(Date.now())+' ';
		special_to_time = getDate(Date.now()+31556952000)+' ';
	};
	let payload = '<Request><Product><Skus><Sku><SellerSku>'+SellerSku+'</SellerSku><Price>'+price+'</Price><SalePrice>'+price_new+'</SalePrice><SaleStartDate>'+special_from_time.split(' ')[0]+'</SaleStartDate><SaleEndDate>'+special_to_time.split(' ')[0]+'</SaleEndDate><Quantity>'+Available+'</Quantity></Sku></Skus></Product></Request>';
    await update(payload,token);

    let check_info = await info(product_id,skuId,token);
    if(price_new !== check_info.special_price){
    	return await make(product_id,price_new,token,skuId)
    }else{
    	return true;
    }

  

	
};
module.exports = make;