const request = require('request-promise');
module.exports = async (token)=>{
	
	let options = {
		url:'https://api.tiki.vn/integration/v1/sellers/me',
		method:'GET',
		headers:{
		    'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72',
		    'Authorization':token
		},
		rejectUnauthorized:false
	};
	let responseText = await request(options);
	return JSON.parse(responseText);
};

