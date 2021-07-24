
module.exports = {

	attributes: {
		id_user:{
			type:'string',
			required:true
		},
		name:{
			type:'string',
			required:true
		},
		token:{
			type:'string',
			required:true
		},
		ec:{
			type:'string',
			required:true
		},
		active:{
			type:'boolean',
			defaultsTo:true
		},
		shop_key_sendo:{
			type:'string'
		},
		secret_key_sendo:{
			type:'string'
		},
		refresh_token_tiki:{
			type:'string'
		},
		refresh_token_lazada:{
			type:'string'
		}
	}

};

