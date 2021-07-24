let validate = async (req)=>await Security.decode((req.headers.cookie+=';').match(new RegExp('(?<=auth\_seu\.vn\=+).*?(?=\;)',"gs"))[0]);

module.exports = async function isLoggedIn(req, res, next) {
  try{
      let {id,log,time} = await validate(req);
      let data = await Account.findOne({id,fullname:'admin',logs:{contains:log}});
      if(!data) throw null;
      return next();
  }catch(error){  
   
    return res.forbidden('Bạn không được phép sử dụng tính năng này.');
  }
};
