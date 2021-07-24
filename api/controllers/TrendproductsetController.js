
const Product = require('../services/get-info-product/product');
let find_newest_product = async (id_user,link_san_pham)=>{
	let data = await TrendProduct.find({where:{id_user,link_san_pham},omit:['id_user']}).limit(1).sort('createdAt DESC');
	return data[0] || {};
};
module.exports = {
	'log-scan-trend':async function(req,res){
		try{
			let {log} = req.body;
			if(!log) throw 'Không tìm thấy log';
			await LogScanTrend.create({log});
			return res.ok();
		}catch(error){
			return res.send({error});
		}
	},
	'get-link':async function(req,res){
		let data = await TrendProductLink.find({});
		return res.send(data)
	},
	'set':async function(req,res){
		try{
			let save_data = await TrendProduct.create(req.body).fetch();
			return res.send(save_data)
		}catch(error){
			return res.send({error});
		}
	}
};

