
module.exports = {

  attributes: {
    id_user:{
        type:'string',
        required:true
    },
    keyword:{
        type:'string',
        required:true,
        unique:true
    },
    product:{
        type:'json',
        required:true
    },
    stock:{
        type:'number',
        defaultsTo:-1
    }
  },

};

