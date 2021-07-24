const request = require('request-promise');
function sanitize_for_regex(s){
	var escaped = '';
	for(var i = 0; i < s.length; ++i){
		switch(s[i]){
			case '{':
			case '}':
			case '[':
			case ']':
			case '-':
			case '/':
			case '\\':
			case '(':
			case ')':
			case '*':
			case '+':
			case '?':
			case '.':
			case '^':
			case '$':
			case '|':
			escaped+= '\\';
			default:
			escaped+= s[i];
		}
	}
	return escaped;
}
let FINDid = (text,startS,lastS)=>{
	startS = sanitize_for_regex(startS);
	lastS = sanitize_for_regex(lastS);
	let myRegEx = new RegExp('(?<='+startS+').*?(?='+lastS+')', 'gi');
	if(text.match(myRegEx)){
		return [...new Set(text.match(myRegEx))]
	}else{
		return []
	}
};
let shopName = async shopId=>{
	let text = await request('https://shopee.vn/api/v2/shop/get?is_brief=1&shopid='+shopId);
	return JSON.parse(text).data.name;
};

module.exports = async function(url){
	if(!url){
		return null
	}

	let itemID = null;
	let ShopID = null;

	if(url.includes('/product/')){
		let section = url.split('/product/')[1].split('/').filter(e=>e.length > 0);
		itemID = section[1];
		ShopID = section[0];
	}else{
		let section = url.split('.');
		itemID = section[section.length-1];
		ShopID = section[section.length-2];
	}


	let options = {
		url:'https://shopee.vn/api/v2/item/get?itemid='+itemID+'&shopid='+ShopID,
		method : 'get',
		headers : {
			'user-agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36'
		}
	};

	let text = await request(options);
	let {item} = JSON.parse(text);

	let {itemid,shopid,name,description,categories,attributes,raw_discount,item_rating: {rating_star,rating_count},price_before_discount,price,images,cmt_count,brand,stock,historical_sold} = item;

	let itemId = itemid;
	let ten_san_pham = name;



	let ten_cua_hang = await shopName(shopid);
	let phan_tram = parseInt(raw_discount) || 0;
	let gia_cu = parseInt(price_before_discount.toString().slice(0, -5)) || 0;
	let gia_moi = parseInt(price.toString().slice(0, -5)) || 0;

	let skuId = itemid;
	let link_san_pham = url;
	let thuong_hieu = ((brand === 'None' || brand === '0')?undefined:brand) || (attributes[0].value);
	let rating = {
		score:parseFloat(rating_star) || 0,
		total:parseInt(rating_count[0]) || 0
	};
	let mo_ta = description;
	let danh_muc = categories.map(({display_name,catid})=>({name:display_name,category_id:catid}))

	let so_luong_con_lai = parseInt(stock) || null;
	let so_luong_da_ban = parseInt(historical_sold) || 0;
	let tong_so_luong = so_luong_con_lai+so_luong_da_ban || null;
	let doanh_thu_du_kien = gia_moi*tong_so_luong || null;
	let doanh_thu_dat_duoc = gia_moi*so_luong_da_ban || null;

	let link_shop = 'https://shopee.vn/shop/'+shopid;
	let full_img_product = images.map(e=>'https://cf.shopee.vn/file/' +e);
	return {itemId,skuId,ten_san_pham,danh_muc,mo_ta,so_luong_con_lai,so_luong_da_ban,tong_so_luong,doanh_thu_du_kien,doanh_thu_dat_duoc,rating,thuong_hieu,ten_cua_hang,phan_tram,gia_cu,gia_moi,link_shop,link_san_pham,full_img_product,ec:'shopee',attributes}

};