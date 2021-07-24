const request = require('request-promise');
module.exports = async (keyword)=>{
	let options = {
		url:'https://www.sendo.vn/m/wap_v2/search/product?p=1&platform=web&q='+encodeURIComponent(keyword)+'&s=60&search_algo=algo6&sortType=rank',
		method:'GET',
		headers:{
			'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72',
			'cookie':'_ga=GA1.2.478854341.1594954294; __cfduid=dca7c859d829018e1b3cd06a87a7805b61595030209; tracking_id=b58b7e30-022b-4301-b1f5-5a4d2925d7cc; _gid=GA1.2.88656994.1595152251; access_token=bM4TbX4I8EETzsVHFGxAl%2Bmp90JpyFAOPLTBhjfZ05Q8%2FvhVYxXvk40WqHyIXraWF8SThNJrKuwn1MpuwChGK3s8WKStEQczX7sYDmUBDcHczvEjTAuXX11PCxXcwQIkq%2Beir%2FArnhwurMS4%2FaCHdA8uXQBOehtPPGdJmKOdkNg%3D; mp_7ee9ac5438d5ed68c57319eb6bf3821f_mixpanel=%7B%22distinct_id%22%3A%20%22173667edbf71a-05ae5ae6f2f55a-4d662277-13c680-173667edbf8694%22%2C%22%24device_id%22%3A%20%22173667edbf71a-05ae5ae6f2f55a-4d662277-13c680-173667edbf8694%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fban.sendo.vn%2Fbang-tin%22%2C%22%24initial_referring_domain%22%3A%20%22ban.sendo.vn%22%7D; search_first=2; useragent=TW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTVfNSkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzgzLjAuNDEwMy4xMTYgU2FmYXJpLzUzNy4zNiBPUFIvNjkuMC4zNjg2Ljc3; '
		},
		rejectUnauthorized:false
	};
	let responseText = await request(options);

	let {result:{data}} = JSON.parse(responseText);
	let {category_id} = data[0];

	let result = [];
	let category_id_split = category_id.split('/').filter(e=>(e !== '1') && (e !=='2'));
	console.log(category_id_split)
	for(let id of category_id_split){
		
		let find_category = await Category.find({where:{ec:'sendo',category_id:id.toString()}});
		
		if(find_category.length > 0){
			let {name,category_id} = find_category[0];
			result.push({name,category_id})
		}
	};
	
	return result;
};