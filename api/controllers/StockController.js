const UpdateStockSendo = require('../services/stock/sendo');
const UpdateStockShopee = require('../services/stock/shopee');
const UpdateStockLazada = require('../services/stock/lazada');
const UpdateStockTiki = require('../services/stock/tiki');

module.exports = {
	'change':async function(req,res){
		try{
			let {id_user} = req;
			let {stock,id} = req.body;
			if(!stock || !id) throw 'Thiếu thuộc tính request';
			if(parseInt(stock) < 0) throw 'Tồn kho không được nhỏ hơn 0';
			let find_stock_combine = await Stock.find({id_user,id});
			if(find_stock_combine.length === 0) throw 'Từ khoá chưa được liên kết';
			let {product} = find_stock_combine[0];
			if(product.length === 0) throw 'Chưa có sản phẩm nào được liên kết với từ khoá';
			let error = [];
			for(let {id,accountec_id,ec,product_id,sku,keyword} of product){
				let find_accountec = await AccountEc.find({id:accountec_id,id_user});
				if(find_accountec.length > 0){
					let {token,ec} = find_accountec[0];
					try{
						if(ec === 'lazada'){
							await UpdateStockLazada(product_id,stock,token,sku)
						}else if(ec === 'shopee'){
							await UpdateStockShopee(product_id,stock,token)
						}else if(ec === 'sendo'){
							await UpdateStockSendo(product_id,stock,token)
						}else if(ec === 'tiki'){
							await UpdateStockTiki(product_id,stock,token)
						}
						await Product.update({id,id_user}).set({stock});
					}catch(e){
						error.push({keyword,error:e})
					}
					
				}
			};
			await Stock.update({id}).set({stock});
			return res.send({error});

		}catch(error){
			return res.send({error});
		}
		

	},
	'update':async function(req,res){
		let {id_user} = req;
		let {keyword,product,id} = req.body;
		let data  = await Stock.update({id,id_user}).set({keyword,product}).fetch();
		return res.send(data);
	},
	'set':async function(req,res){
		try{
			let {id_user} = req;
			let {keyword,product} = req.body;
			let find_keyword = await Stock.find({keyword,id_user});
			if(find_keyword.length > 0) throw 'Từ khoá '+keyword+' đã được thiết lập trước đó.';
			let data = await Stock.create({id_user,keyword,product}).fetch();
			
			await StockSave.destroy({id_user,keyword});
			
			for(let {id} of product){
				try{
					await StockSave.create({id_user,keyword,product_id:id})
				}catch(e){

				}
				
			}
			return res.send(data);
			
		}catch(error){
			return res.send({error});
		}
	},
	'get':async function(req,res){
		let {id_user} = req;
		let data = await Stock.find({id_user});
		return res.send(data);
	},
	'get-stocksave':async function(req,res){
		let {id_user} = req;
		let {id} = req.body;
		let where = {id_user};
		if(id) where.id = id;
		let data = await StockSave.find(where);
		return res.send(data);
	},
	'remove':async function(req,res){
		try{
			let {id_user} = req;
			let {id} = req.body;
			let find_keyword = await Stock.find({id_user,id});
			if(find_keyword.length === 0) throw 'Không tìm thấy từ khoá'
				let {keyword} = find_keyword[0];
			await Stock.destroy({id_user,id});
			await StockSave.destroy({id_user,keyword});
			return res.ok();
		}catch(error){
			return res.send({error});
		}
		
	}
};

