const request = require('request-promise');
const sha256 = require('js-sha256');

const get_info = async function(item_id,shopid){
	let options = {
		method: 'POST',
		url: 'https://partner.shopeemobile.com/api/v1/item/get',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			item_id,
			"partner_id":845907,
			shopid,
			"timestamp":parseInt(Date.now()/1000)
		})

	};
	options.headers.Authorization = sha256.hmac('bVjs9TTxKo4f0cLNOZsX6pQlChBvfXNWw5ITE72ZjNr8uXnRfw5UQVKiNTV6xIgM',options.url+'|'+options.body);

	
	let responseText = await request(options);
	
	let {item:{item_sku,name,images,stock,price,status}} = JSON.parse(responseText);
	return {
		product_id:item_id.toString(),
		sku:item_sku.toString(),
		name,
		image:images[0],
		price:price || 0,
		quantity:stock || 0,
		active:status === 'NORMAL',
		url:'https://shopee.vn/product/'+shopid+'/'+item_id,
		ec:'shopee'
	}
};
let get_list = async function(shopid,page = 1,result = []){
	let options = {
		method: 'POST',
		url: 'https://partner.shopeemobile.com/api/v1/items/get',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"pagination_offset":(page-1)*10,
			"pagination_entries_per_page":100,
			"partner_id":845907,
			shopid,
			"timestamp":parseInt(Date.now()/1000)
		})

	};
	
	options.headers.Authorization = sha256.hmac('bVjs9TTxKo4f0cLNOZsX6pQlChBvfXNWw5ITE72ZjNr8uXnRfw5UQVKiNTV6xIgM',options.url+'|'+options.body);
	
	let responseText = await request(options);
	
	
	let {items,error} = JSON.parse(responseText);
	if(error) return result;
	let result_data = items.map(({item_id,status})=>({id:item_id,active:status === 'NORMAL'}));
	result = result.concat(result_data);
	if(result_data.length > 0){
		page+=1;
		return await get_list(shopid,page,result)
	}else{
		return result;
	}
};
module.exports = async (id_user,accountec_id,shopid)=>{
	shopid = parseInt(shopid);
	let list = await get_list(shopid);
	await Product.destroy({id_user,accountec_id,ec:'shopee'});
	for(let {id} of list){
		
		let data = await get_info(id,shopid);
		await Product.create({...data,id_user,accountec_id});
	};
	return;

};