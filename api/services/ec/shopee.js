const info = require('./ecommerce/shopee');


module.exports = async function(shopid){
	
	let info_data = await info(shopid);
	return {...info_data,shopid:shopid.toString()}
}