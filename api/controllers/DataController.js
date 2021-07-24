/**
 * DataController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 module.exports = {
 	'get-data':async function(req,res){
 		try{
 			let {url} = req.body;
 			if(!url) return res.send({error:'Không tìm thấy URL'});
 			let data = await LoadPage(url);
 			data.url = url;
 			await Data.destroy({url});
 			await Data.create(data)
 			return res.send(data);
 		}catch(error){
 			console.log(error);
 			return res.send({error})
 		}
 	},
 	'get-link':async function(req,res){
 		try{
 			let {keyword} = req.body;
 			if(!keyword) return res.send({error:'Không tìm thấy từ khóa'});
 			let data = await Search(keyword);
 			return res.send(data);

 		}catch(error){
 			return res.send({error})
 		}
 	},
 	'export-excel':async function(req,res){
 		// em phải đi nấu cơm ăn cơm đây,hẹn bác sáng mai mình tiếp tục o
 	// okkkk bác nha ^^! cảm ơn^ ^bác n hiều hnahhaah âmi gặp nhaok ok ok ok ok ok ok ô o ko ko k
 	}


 };

