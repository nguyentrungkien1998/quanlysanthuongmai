const request = require('request-promise');
const get_fee_ship = async (orderId,token)=>{
	let options = {
		url:"https://open.sendo.vn/api/partner/salesorder/"+orderId,
		method:'GET',
		headers:{
			"authorization":token
		},
		rejectUnauthorized:false
	};
	let responseText = await request(options);

	let {result:{sales_order:{shipping_fee}}} = JSON.parse(responseText);
	return parseInt(shipping_fee);
};
let date_time_now = (start,end)=>{
	let start_time = new Date(start);
	let frDate = start_time.getFullYear() +'/'+(start_time.getMonth()+1)+'/'+start_time.getDate();
	let end_time = new Date(end);
	let ttDate = end_time.getFullYear() +'/'+(end_time.getMonth()+1)+'/'+end_time.getDate();
	return {frDate,ttDate} 
};
let get_status = (code_status)=>{
	let list_code = [
	{code:'2',description:'pending'},
	{code:'3',description:'Đang xừ lý'},
	{code:'6',description:'Đang vận chuyển'},
	{code:'7',description:'Đã giao hàng'},
	{code:'8',description:'Đã hoàn tất'},
	{code:'10',description:'Đơn hàng bị khiếu nại'},
	{code:'11',description:'Yêu cầu hoãn'},
	{code:'12',description:'Đang hoãn'},
	{code:'13',description:'Hủy'},
	{code:'14',description:'Yêu cầu tách'},
	{code:'15',description:'Chờ tách'},
	{code:'19',description:'Chờ gộp'},
	{code:'23',description:'Chờ sendo xử lý'},
	{code:'21',description:'Đang đổi trả'},
	{code:'22',description:'Đang trả thành công'}
	];
	return (list_code.find(({code})=>code == code_status) || {description:'Không xác định'}).description
};
let make = async (token,accountec_id,id_user,page = 1,next_t = null)=>{
	
	let options = {
		url:'https://open.sendo.vn/api/partner/salesorder/search',
		method:'POST',
		headers:{
			'Content-Type': 'application/json',
			'cache-control': 'no-cache',
			"Authorization":token
		},
		rejectUnauthorized:false,
		body:JSON.stringify({
			"page_size": 10,
			"order_date_from": "2010-05-01",
			"order_date_to": "2099-05-07",
			"order_status_date_from": null,
			"order_status_date_to": null,
			"token":next_t
		})
	};
	
	let responseText = await request(options);
	let {result:{data,next_token}} = JSON.parse(responseText);
	
	let result_map =  data.map(async e=>{
		let {sales_order:{receiver_name,order_date_time_stamp,order_number,buyer_address,buyer_phone,sub_total,payment_method,order_status},sku_details} = e;
		items = sku_details.map(({product_variant_id,product_name,quantity})=>({product_id:product_variant_id,product_name:product_name,quantity}));
		
		return {
			time:new Date(parseInt(order_date_time_stamp)).getTime(),
			order_id:order_number.toString(),
			name:receiver_name.toString(),
			address:buyer_address.toString(),
			phone:buyer_phone.toString(),
			items,
			price:parseInt(sub_total),
			payment_fee:await get_fee_ship(order_number,token),
			payment_method:(payment_method === 1) ? 'COD' : 'Online',
			status:get_status(order_status),
			ec:'sendo'
		}
		
	});
	let result_data = await Promise.all(result_map);

	if(page === 1) await Order.destroy({accountec_id,id_user});
	for(let item of result_data){
		await Order.create({...item,accountec_id,id_user})
	}


	if((result_data.length > 0) && next_token){
		page+=1;
		return await make(token,accountec_id,id_user,page,next_token)
	}else{
		return 0;
	}
};
module.exports = make;