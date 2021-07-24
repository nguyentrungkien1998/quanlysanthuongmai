
const fs = require('fs');
const random = require('randomstring');
const {head:{title},domain,limit_log,permission} = require('../../nuxt.config');
let validate = async (req)=>await Security.decode((req.headers.cookie+=';').match(new RegExp('(?<=auth\_seu\.vn\=+).*?(?=\;)',"gs"))[0]);
module.exports = {
	info:async function(req,res){
		
		try{
			let {id,log,time} = await validate(req);
			let data = await Account.findOne({where:{id,logs:{contains:log}},omit:['pass_hash','logs','id_user']});
			if(!data) throw null;
			return res.json(data);
		}catch(error){
			return res.send({error:'Token hết hạn'})
		}
	},
	'check-exists':async function(req,res){
		try{
			let {phone} = req.body;
			if((phone || '').length !== 10) throw 'Số điện thoại không đúng định dạng.';
			let find = await Account.findOne({phone});
			
			if(find) throw 'Số điện thoại này đã được đăng kí !';
			return res.ok();
		}catch(error){
			return res.send({error});
		}
	},
	'verify-phone':async function(req,res){
		try{
			let {code,sessionInfo} = req.body;
			let {phoneNumber} = await VerifyPhone(code,sessionInfo);
			let phone = phoneNumber.replace('+84','0');
			let token_phone = random.generate(100);
			await Verify.destroy({phone});
			await Verify.create({phone,token_phone});
			return res.send({token_phone});
		}catch(error){
			return res.send({error})
		}
	},
	'get-number-phone':async function(req,res){
		try{
			let {token_phone} = req.body;
			if((token_phone || '').length < 10) throw 'Token không đúng định dạng.';
			let data = await Verify.findOne({token_phone});
			if(!data) throw 'Token hết hạn.'
				return res.send({phone:data.phone});
		}catch(error){
			return res.send({error});
		}
	},
	register:async function(req,res){
		try{
			let {fullname,phone,password} = req.body;

			
			let find_exists = await Account.find({phone});
			if(find_exists.length > 0) throw 'Số điện thoại này đã được sử dụng.';
			if(fullname.trim() === 'admin') throw 'Tên sử dụng không hợp lệ.';
			let pass_hash = await Security.encode(password);
			let id_user = await random.generate(50);
			let log = random.generate(32);
			await Account.create({id_user,fullname,phone,pass_hash,permission:[],logs:[log]});
			let token = await Security.encode({id_user,log,time:Date.now()})
			return res.send({fullname,token});

		}catch(error){
			return res.send({error})
		}
	},
	permission:async function(req,res){
		try{
			let {id,log,time} = await validate(req);
			let data = await Account.findOne({id,logs:{contains:log}});
			if(!data) throw null;
			return res.send(permission.filter(({slug})=>data.permission.includes(slug)))
			
		}catch(error){
			return res.send({error:'Token hết hạn'})
		}
	},
	login:async function(req,res){
		try{
			
			let {phone,password} = req.body;
			
			if(!phone) throw 'Quý khách chưa nhập thông tin Email hoặc Số điện thoại .';
			let find = null;
			
			if((phone === 'admin')) find = await Account.findOne({phone:'admin'})
				else if(phone) find = await Account.findOne({phone});
			if(!find) throw 'Quý khách chưa đăng kí tài khoản này.';

			let {id_user,pass_hash,logs,fullname} = find;

			let password_user = await Security.decode(pass_hash);

			if(password !== password_user) throw 'Mật khẩu tài khoản không chính xác !';
			let log = random.generate(32);
			
			logs.unshift(log);
			logs.slice(0,limit_log);
			await Account.update({id_user}).set({logs});


			let token = await Security.encode({id_user,log,time:Date.now()})
			
			return res.json({token,fullname});

		}catch(error){
			
			return res.send({error});
		}
	},
	'check-password':async function(req,res){
		try{
			let {id_user,log,time} = await validate(req);
			let data = await Account.findOne({id_user,logs:{contains:log}});
			if(!data) throw null;
			let {password} = req.body;
			let {pass_hash} = data;
			let password_user = await Security.decode(pass_hash);

			if(password !== password_user) throw true;
			let code = await Security.encode({id_user,log,time:Date.now(),hash:'8e3t5ds3h73g2g83vsdg2gadtyaeryte46u4w6w4tw4vewweqttu'});
			return res.send({code});
		}catch(error){
			return res.send({error:'Mật khẩu tài khoản không chính xác !'})

		}
	},
	'update-password':async function(req,res){
		try{
			let {id_user,log,time} = await validate(req);
			let data = await Account.findOne({id_user,logs:{contains:log}});
			if(!data) throw null;
			let {password,code} = req.body;
			let data_decode = await Security.decode(code);
			if(data_decode.log !== log) throw true;
			let pass_hash = await Security.encode(password);
			await Account.update({id_user}).set({pass_hash});
			return res.ok();
		}catch(error){
			return res.send({error:'Phiên đăng nhập đã hết hạn.'})

		}
	},
	'logout':async function(req,res){
		try{
			let {id,log,time} = await validate(req);
			let {device} = req.body;
			
			let data = await Account.findOne({id,logs:{contains:log}});

			if(!data) throw null;
			let {logs} = data;
			logs = device === '1' ? logs.filter(e=>e !== log) : [];
			await Account.update({id}).set({logs});
			return res.ok();
		}catch(error){
			return res.send({error:'Quý khách vui lòng thực hiện đăng xuất lại.'});
		}
	}

};

