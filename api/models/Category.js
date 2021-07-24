
module.exports = {

  attributes: {
    parent_id:{
        type:'string',
        required:true
        
    },
    category_id:{
        type:'string',
        required:true
    },
    name:{
        type:'string',
        required:true
    },
    ec:{
        type:'string',
        required:true
    },
    level:{
        type:'number',
        required:true
    },
    leaf:{
        type:'boolean',
        defaultsTo:true
    }
  }

};

