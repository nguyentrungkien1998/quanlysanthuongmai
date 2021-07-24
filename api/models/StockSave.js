

module.exports = {

  attributes: {
    id_user:{
      type:'string',
      required:true
    },
    product_id:{
      type:'string',
      required:true,
      unique:true
    },
    keyword:{
      type:'string',
      required:true
    }

  },

};

