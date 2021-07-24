let validate = async (req)=>await Security.decode((req.headers.cookie+=';').match(new RegExp('(?<=auth\_seu\.vn\=+).*?(?=\;)',"gs"))[0]);

module.exports = async function isLoggedIn(req, res, next) {
  
  try{
      let {id_user,log,time} = await validate(req);
      let data = await Account.findOne({id_user,logs:{contains:log}});
      if(!data) throw null;
      req.id_user = id_user;
      req.log = log;
      req.time = time;
      return next();
  }catch(error){  
    return res.forbidden({error:'Token hết hạn'});
  }
};
