const request = require('request-promise');
let make = async (token,accountec_id,id_user,start = 0,end = Date.now(),page = 1)=>{
	let options = {
		url:'https://api.tiki.vn/integration/v1/orders?page='+page+'&limit=50&status=all',
		method:'GET',
		headers:{
			'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72',
			'Authorization':token
		},
		rejectUnauthorized:false
	};
	let responseText = await request(options);
	let {data} = JSON.parse(responseText);

	let result_data = data.map(e=>{
		
		let {created_at,status,fulfillment_type,order_code,shipping:{name,street,ward,city,region,country,phone,shipping_fee},items,payment:{payment_method,description},collectable_total_price} = e;
		items = items.map(({product_id,product_name,qty})=>({product_id,product_name,quantity:qty}))
		return {
			time:new Date(created_at).getTime(),
			order_id:order_code.toString(),
			name:name.toString(),
			address:street+','+ward+','+city+','+region+','+country,
			phone:phone.toString(),
			items,
			price:parseInt(collectable_total_price),
			payment_fee:parseInt(shipping_fee),
			payment_method:payment_method.toUpperCase(),
			status:status+' '+fulfillment_type,
			ec:'tiki'
		}
	});
	
	let time_end = result_data.map(({time})=>time).sort().reverse()[0] || Date.now();
	if(page === 1) await Order.destroy({accountec_id,id_user});
	if((result_data.length > 0) && (end >= time_end) && (time_end >= start)){
		
		for(let item of result_data){
			await Order.create({...item,accountec_id,id_user})
		}
		page+=1;
		return await make(token,accountec_id,id_user,start,end,page);
	}else{
		result_data = result_data.filter(({time})=>(time >= start) && (end >= time));
		
		for(let item of result_data){
			await Order.create({...item,accountec_id,id_user})
		}
		return
	}
};
module.exports = make;