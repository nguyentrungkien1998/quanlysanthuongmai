 
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
cloudinary.config({ 
	cloud_name: 'doo4xi4rh', 
	api_key: '823141655849989', 
	api_secret: 'lbu3bepxZXlDUbAsM_OmUTvQVeE' 
});

module.exports = {
	image:async function(req,res){
		
		let stream = cloudinary.uploader.upload_stream((error, result) => {
			if (result) {
				return res.send(result)
			} else {
				return res.send(error)
			}
		});
		

		streamifier.createReadStream(req.file.buffer).pipe(stream);
	},
	'remove-image':async function(req,res){
		let {public_id} = req.body;
		cloudinary.uploader.destroy(public_id, function(result) { 
			return res.ok();
		});
	}
};

