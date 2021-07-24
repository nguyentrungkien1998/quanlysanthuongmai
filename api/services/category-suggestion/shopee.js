const request = require('request-promise');
const info = require('../get-info-product/product');
module.exports = async (keyword)=>{
	var headers = {
		'authority': 'shopee.vn',
		'x-shopee-language': 'vi',
		'x-requested-with': 'XMLHttpRequest',
		'if-none-match-': '*',
		'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 OPR/70.0.3728.178',
		'x-api-source': 'pc',
		'accept': '*/*',
		'sec-fetch-site': 'same-origin',
		'sec-fetch-mode': 'cors',
		'sec-fetch-dest': 'empty',
		'referer': 'https://shopee.vn/search?keyword=ao%20nu%20dep&page=1',
		'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en;q=0.6,en-US;q=0.5',
		'cookie': '_gcl_au=1.1.1197749114.1599230411; _med=refer; _fbp=fb.1.1599230416934.754119530; SPC_F=EWIsJhgOFWmcwu0KDeDHWX84K8miD0Mn; REC_T_ID=8f8a8186-eebc-11ea-b7d8-3c15fb3af316; _ga=GA1.2.181755896.1599230428; _hjid=ae9200ce-0b00-40ab-ac09-13aef8aa44f4; csrftoken=j9F8azrlGUU9I4WJqM9hY5NzSuRW01vI; welcomePkgShown=true; SPC_SC_TK=7f5693ffcca050a29bb912c992ea5f7e; SPC_SC_UD=271551662; SPC_U=271551662; SPC_WST="pUNJCV9yVdSanR5z/XfPBbJ/4tJiYJJGNrQLK6+uWgnXS0/W5zRRphvbfQuQ+ZY6JjlJRJ8MAsrIXnC12pTvIE8QdXbUK006fzCLMr50WiFE2Ig18OzEPIxHcGe4EHjE8X5xhaynXLjM3ZFbH/HA6TvzIZl/stg6quo9wxVvA30="; SPC_IA=1; SPC_EC=pUNJCV9yVdSanR5z/XfPBbJ/4tJiYJJGNrQLK6+uWgnXS0/W5zRRphvbfQuQ+ZY6JjlJRJ8MAsrIXnC12pTvIE8QdXbUK006fzCLMr50WiFE2Ig18OzEPIxHcGe4EHjE8X5xhaynXLjM3ZFbH/HA6TvzIZl/stg6quo9wxVvA30=; _gid=GA1.2.1978856238.1600316686; SPC_SI=mall.9ySaoFQ6UBDp9o6cxfvfAr1zqbN516yJ; _hjAbsoluteSessionInProgress=0; SPC_CT_c965fa6f="1600475247.juYWaQ8aPsZFh+9Yvq88opkWhgVcL+aK77kGRaDl14Y="; AMP_TOKEN=%24NOT_FOUND; SPC_CT_94bd32ff="1600475449.lP1XZ27ILMlNNZLIS9BSiaYJHZDe/s/XGajrON2Qtc0="; SPC_CT_592b8954="1600475488.Af20jBuZJScvLfG6eE/rMtF6nQG7iVxvHtpk3ih3di0="; SPC_CT_2c798750="1600475703.+CxCNOGkLZOds4nj8VqprI/BT8hEbzggRkMF6sFM9zo="; SPC_CT_b7d50868="1600476018.JxlJnyQeku5cNlGFAZ4N8+8FGnEnyACgphmwLFCBPas="; SPC_CT_bc5a2e84="1600476041.TAc/EB3C9hbBvdJrM8CImDo9tKSVPpmD9b4p47Fz/tU="; SPC_CT_e88c0ce4="1600476158./t/dxNKeQQtETIOFV2+wXTmB7/6EdwKHYxVLEoKumpbjHszu75W2HsrrTzoalPaT"; SPC_CT_f5464708="1600476454.rTzJmcg60HPXB0qOGK3mblO2euQpDPbNG/Qf4iJ4gRvOBM1F+tL2DhmvlBmEs815"; REC_MD_41_1000121=1600476980_0_50_0_46; _dc_gtm_UA-61914164-6=1; SPC_CT_10b8660c="1600476686./rL+zaj9jmJAmNrtcIYU2xBnTcXhElxIa/z+NShcVhQ="; SPC_R_T_ID="LfzA5Vc4Xp54ksjdwoQnezILb7Hpq0hnqneQ98zfTmqaCAnpyu53rzgNufE3Ea9g3dLSmCx7JZqkM5GZsnEzfaZ6YotAvoBaEa6zhCq8XEs="; SPC_T_IV="56c1ATIK5OjvjctFMuUWpQ=="; SPC_R_T_IV="56c1ATIK5OjvjctFMuUWpQ=="; SPC_T_ID="LfzA5Vc4Xp54ksjdwoQnezILb7Hpq0hnqneQ98zfTmqaCAnpyu53rzgNufE3Ea9g3dLSmCx7JZqkM5GZsnEzfaZ6YotAvoBaEa6zhCq8XEs="',
		'if-none-match': '*'
	};

	var options = {
		url: 'https://shopee.vn/api/v2/search_items/?by=relevancy&keyword='+encodeURIComponent(keyword)+'&limit=25&newest=0&order=desc&page_type=search&version=2',
		headers: headers
	};

	let responseText = await request(options);
	let {items} = JSON.parse(responseText);
	if(items.length === 0) return [];
	let {itemid,shopid} = items[0];
	let link = 'https://shopee.vn/product/'+shopid+'/'+itemid;

	let data = await info(link);
	return data.danh_muc;
};