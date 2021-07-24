
const UpdatePriceSendo = require('../services/price/sendo');
const UpdatePriceShopee = require('../services/price/shopee');
const UpdatePriceTiki = require('../services/price/tiki');
const UpdatePriceLazada = require('../services/price/lazada');

module.exports = {
	'price':async function(req,res){
		try{
			let {id_user} = req;
			let {product_id,accountec_id,price_new,ec} = req.body;
			if(ec === 'lazada'){
				let find_acc = await LazadaEc.find({id_user,id:accountec_id});
				if(find_acc.length === 0) throw 'Không tìm thấy cửa hàng liên kết';
				let {access_token} = find_acc[0];
				let find_product = await Product.find({id_user,ec:'lazada',product_id});
				if(find_product.length === 0) throw 'Không tìm thấy sản phẩm phù hợp với product_id';
				let {sku} = find_product[0];
				await UpdatePriceLazada(product_id,price_new,access_token,sku)
			}else if(ec === 'sendo'){
				let find_acc = await SendoEc.find({id_user,id:accountec_id});
				if(find_acc.length === 0) throw 'Không tìm thấy cửa hàng liên kết';
				let {token} = find_acc[0];
				await UpdatePriceSendo(product_id,price_new,token);
			}else if(ec === 'shopee'){
				let find_acc = await ShopeeEc.find({id_user,id:accountec_id});
				if(find_acc.length === 0) throw 'Không tìm thấy cửa hàng liên kết';
				let {shopid} = find_acc[0];
				await UpdatePriceShopee(product_id,price_new,shopid);
			}else if(ec === 'tiki'){
				let find_acc = await TikiEc.find({id_user,id:accountec_id});
				if(find_acc.length === 0) throw 'Không tìm thấy cửa hàng liên kết';
				let {access_token} = find_acc[0];
				await UpdatePriceTiki(product_id,price_new,access_token);
			}
			
			
		
			await Product.update({id_user,product_id}).set({price:price_new});
			return res.ok();
		}catch(error){
			return res.send({error});
		}		
	}
};

