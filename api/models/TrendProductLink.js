

module.exports = {

  attributes: {
    id_user:{
        type:'string',
        required:true
    },
    link_san_pham:{
        type:'string',
        required:true
    },
    ten_san_pham:{
        type:'string'
    },
    ten_san_pham_alias:{
        type:'string'
    },
    ec:{
        type:'string',
        required:true
    }
},
beforeCreate(val,callback){

    val.ten_san_pham_alias = val.ten_san_pham.replace(/ /g,'').toLowerCase();
    return callback();
}

};

