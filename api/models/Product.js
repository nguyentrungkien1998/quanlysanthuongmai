
module.exports = {

  attributes: {
    id_user:{
        type:'string',
        required:true
    },
    accountec_id:{
        type:'string',
        required:true
    },
    product_id:{
        type:'string',
        required:true
    },
    sku:{
        type:'string'
    },
    name:{
        type:'string'
    },
    name_alias:{
        type:'string'
    },
    image:{
        type:'json',
        defaultsTo:[]
    },
    price:{
        type:'number'
    },
    quantity:{
        type:'number'
    },
    active:{
        type:'boolean'
    },
    url:{
        type:'string'
    },
    ec:{
        type:'string'
    }

},
beforeCreate(val,callback){
    val.name_alias = val.name.replace(/ /g,'').toLowerCase();
    return callback();
}

};

