const shopee = require('../services/order/status/shopee');
const lazada = require('../services/order/status/lazada');
const sendo = require('../services/order/status/sendo');
module.exports = {
	'confirm':async function(req,res){
		try{
			let {id_user} = req;
			let {ec,order_id,accountec_id} = req.body;
			if(ec === 'lazada'){

			}else if (ec === 'tiki'){

			}else if (ec === 'shopee'){
				let find_acc = await ShopeeEc.find({id_user,id:accountec_id});
				if(find_acc.length === 0) throw 'Tài khoản Shopee chưa được liên kết';
				await shopee.AcceptBuyerCancellation(order_id,find_acc[0].shopid)
			}else if (ec === 'sendo'){

			}else {
				throw 'Không tìm thấy tài khoản sàn';
			}
			return res.ok();
		}catch(error){
			console.log(error)
			return res.send({error});
		}
	}
};

