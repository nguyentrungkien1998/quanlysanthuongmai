/**
 * UpProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const ParamSendo = require('../services/Param/sendo');
const ParamLazada = require('../services/Param/lazada');
 module.exports = {
 	
 	'sendo':async function(req,res){
 		try{
 			let {id_user} = req;
 			let {id_category} = req.body;
 			let find_sendo = await AccountEc.findOne({active:true,id_user,ec:'sendo'});
 			if(!find_sendo) throw 'Chưa có tài khoản Sendo nào được liên kết !';
 			let {token} = find_sendo;
 			let data = await ParamSendo(id_category,token);
 			return res.send(data);
 		}catch(error){
 			return res.send({error});
 		}

 	},
 	'lazada':async function(req,res){
 		try{
 			let {id_user} = req;
 			let {id_category} = req.body;
 			let find_lazada = await AccountEc.findOne({active:true,id_user,ec:'lazada'});
 			if(!find_lazada) throw 'Chưa có tài khoản Lazada nào được liên kết !';
 			let {token} = find_lazada;
 			let data = await ParamLazada(id_category,token);
 			return res.send(data);
 		}catch(error){
 			return res.send({error});
 		}
 	}

 };

