
module.exports = {
	data:async function(req,res){
		let {id_user} = req;
		let {link_san_pham} = req.body;
		let data = await TrendProduct.find({id_user,link_san_pham}).sort('createdAt ASC');
		return res.send(data);
	}
};

