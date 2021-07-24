const request = require('request-promise');
module.exports = async (keyword)=>{
	var headers = {
		'authority': 'www.lazada.vn',
		'accept': 'application/json, text/plain, */*',
		'x-umidtoken': 'T2gAI8Wcson5bPzMOhicPmf2mW4NhdWNRm1mgr_aAZA3Afnnzjt00h1hfk33Z-iKhjm3AhF0OjC_y4nxPYdKrS9k',
		'x-csrf-token': '7e4b607a3ee1e',
		'x-requested-with': 'XMLHttpRequest',
		'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36 OPR/71.0.3770.271',
		'x-ua': '137#TJ99hE9o9K40RUQ9pcJGD79GIn9b6weQvIxqWszdjnD1g9ZET1xXuBRtsn8DPR+Ynv9n+rJOvlnL5UMyW+JFOE3M6lees8vcfG09+cncY0cR7472X/bAWnjRIX6AHFvAsv9FQ8X0CC8Dks0na4Ql3Fh53VQYuM4NGzGPeP9sdPgeRpIpQVSAm8LdPrPZtoKSoQ5XARCsGR3trZLTN29shyswiLizxVGg2Nw+3Y08lsbP4dPMgif2lk1YSQNrntstyMsfW2dfXj4XyWIFmh/8im7TbDgYNHv3zI1Q0mTiRco6ss1lzDHt2UUD+3BvmNCRfB8ueGpc8I1T5qOlAw2KBqu54Lctb28ayBgh73vv3F8r9A+AM0ezEGX3WOj8wHzSCnZZz3IXZcigIZBBfxqqTTIcM0Jc1Iei+tP+QyJo1qgyF06f0pJo+GXVpRUc1AeydtiVYnfnuV/tpXpsQenJ+ZDVppfcbAMJcXIMeylCEQTUUEw8QLbJiaMXpGJmzIEi+ppVYTJo1qQipXpcQDao+Zg0pkUm1AEy+pipYSJSacj75p6X9+VUz051i9o9i+qaYoasOddI/IQgVFnpi8p4txf69n5sOJQY54sc2Aj9J/dN6O1Dv6FesxqHI4CmJ0Yhh6cWq0FQrsr7sX8MI7hbHdN6LXnfmqgL0tdOVZqFOo+SVfvHMWnid/VX77tau+CmcTnCR8JK5e6FfhGoh9UhKN2m7ZSKqqyWOpouLekNeJGg3mUd+CQe9vegv0mAHAmW3U4S3CmJ0ML3Lxqkdp0Do2PmT9PORLsZrVlk9wZ9ydWONQqEzRrGMMQY+D3Pu3UKBZeQhdKBKrOohoBFxjWblT4qIu5C1hQLeWYOdCwynZrR09NmbUgkrNnqQO57/2+AK20+fJYvkBRLW2UcAsiYFIvO46J6EHU7D+jivZRfw6zjACJ5dbs8pnFPuFzcp3YvgpY/YTzb',
		'sec-fetch-site': 'same-origin',
		'sec-fetch-mode': 'cors',
		'sec-fetch-dest': 'empty',
		'referer': 'https://www.lazada.vn/catalog/?_keyori=ss&from=input&page=2&q=microlab&spm=a2o4n.home.search.go.19056afehNdn7P',
		'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en;q=0.6,en-US;q=0.5',
		'cookie': 'JSID=5c3154879ce4aace712af38d414993d6; CSRFT=e8e9d70173b55; TID=dc9fd14e48ff0b3f595e286d4c484883; t_fv=1602118778609; t_uid=ojq4mR6qMgomIvCimnyC8YykaNe3oNaE; cna=3YwEGNN/M3YCASpy8rY2CPuB; _ga=GA1.2.1388993295.1602118801; XSRF-TOKEN=7d672a5a-898d-450b-970b-fa166824a166; lzd_cid=d8782881-eb8c-4942-9abc-19e4e5c5ee19; lzd_sid=11471d2f50f90c8a1edb1d89af6f692e; hng=VN|vi|VND|704; userLanguageML=vi; _bl_uid=jyk1pgUb778avC8vqu1Ofdtzewth; _fbp=fb.1.1602552272604.518404695; __wpkreporterwid_=e5cc8ee9-9f1d-4f94-2f53-c466b69e4e49; _tb_token_=7e4b607a3ee1e; _lang=en_US; _gac_UA-30172376-1=1.1602945399.CjwKCAjwrKr8BRB_EiwA7eFapqVwQSouPeeX81xVppHJaOtikb82_WOft9iN4h06ZtubLzrswBJ1ThoChEcQAvD_BwE; t_sid=q5dWgyhGXmqKxJEOXH3p7z9FO6c1KTSV; _m_h5_tk=82030e87dbcab014e97eb4fcd4211a79_1603262714386; _m_h5_tk_enc=f017416c1c9ede6aeef8369659641adb; utm_channel=NA; xlly_s=1; _uetsid=305a9a10135311eba7810b46b222e958; _uetvid=d8a48f600cf211eb84fa2b0511b8b0b7; JSESSIONID=0A724A83B3DA5E743AD183E5DDFAB91B; l=eBPK_fGIOKzGlah6BOfwPurza77tLKRmSuPzaNbMiOB1tXC_adjg2HwHHVa6d3QLttfvRetr3iyRfREDW-aU5tTXAr0qW5dJDuvGI; tfstk=ctKFBsa8egA1qJsSkMszRpERBGWdaPKD25W5-UWy3ZWmvvQhgs48wO4NoN7fcm_h.; isg=BBAQya5CexxyLScSuxxG0R7j8Vhi2fQjeQ0LoQrhimv-RbPvsutYstGzHBWlqKz7'
	};

	var options = {
		url: 'https://www.lazada.vn/catalog/?_keyori=ss&ajax=true&from=input&page=1&q='+encodeURIComponent(keyword)+'&spm=a2o4n.home.search.go.19056afehNdn7P',
		headers: headers
	};

	let responseText = await request(options);
	let {mods:{listItems}} = JSON.parse(responseText);
	if(listItems.length === 0) return [];
	let result = [];
	for(let category_id of listItems[0].categories){
		let find_category = await Category.find({category_id,ec:'lazada'});
		if(find_category.length > 0){
			let {category_id,name} = find_category[0];
			result.push({category_id,name})
		}
	};
	return result;
};