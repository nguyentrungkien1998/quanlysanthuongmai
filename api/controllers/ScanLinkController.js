const ProductInfo = require('../services/get-info-product/product');


module.exports = {
	'add/sendo':async function(req,res){
		try{
			let {id_user} = req;
			let {link} = req.body;
			link = link || '';
			if(!(link.includes('sendo.vn') && link.includes('.html'))) throw 'Link sản phẩm tại Sendo không hợp lệ. ERR:1';
			let data = await ProductInfo(link);
			if(data.ten_san_pham){
				await ScanLink.create({id_user,link,ec:'sendo'});
				return res.send({success:true});
			}else{
				throw 'Link sản phẩm tại Sendo không hợp lệ. ERR:2';
			}
		}catch(error){
			return res.send({error});
		}
	},
	'add/shopee':async function(req,res){
		try{
			let {id_user} = req;
			let {link} = req.body;
			link = link || '';
			if(!(link.includes('shopee.vn'))) throw 'Link sản phẩm tại Shopee không hợp lệ. ERR:1';
			let data = await ProductInfo(link);
			if(data.ten_san_pham){
				await ScanLink.create({id_user,link,ec:'shopee'});
				return res.send({success:true});
			}else{
				throw 'Link sản phẩm tại Shopee không hợp lệ. ERR:2';
			}
		}catch(error){
			return res.send({error});
		}
	},
	'remove':async function(req,res){
		try{
			let {id_user} = req;
			let {id} = req.body;
			if(!id) throw 'Không tìm thấy ID Link sản phẩm';
			await ScanLink.destroy({id});
			return res.send({success:true})
		}catch(error){
			return res.send({error});
		}
	}
};

