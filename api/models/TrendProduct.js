
module.exports = {

    attributes: {
        id_user:{
            type:'string',
            required:true
        },
        itemId:{
            type:'string',
            required:true
        },
        skuId:{
            type:'string',
            required:true
        },
        ten_san_pham:{
            type:'string',
            required:true
        },
        ten_san_pham_alias:{
            type:'string'
        },
        so_luong_con_lai:{
            type:'number',
            allowNull:true
        },
        so_luong_da_ban:{
            type:'number',
            allowNull:true
        },
        tong_so_luong:{
            type:'number',
            allowNull:true
        },
        doanh_thu_du_kien:{
            type:'number',
            allowNull:true
        },
        doanh_thu_dat_duoc:{
            type:'number',
            allowNull:true
        },
        rating:{
            type:'json'
        },
        thuong_hieu:{
            type:'string'
        },
        ten_cua_hang:{
            type:'string',
            required:true
        },
        phan_tram:{
            type:'number',
            defaultsTo:0
        },
        gia_cu:{
            type:'number',
            allowNull:true

        },
        gia_moi:{
            type:'number',
            allowNull:true
        },
        link_shop:{
            type:'string',
            defaultsTo:''

        },
        link_san_pham:{
            type:'string',
            required:true
        },
        ec:{
            type:'string',
            required:true
        },
        log:{
            type:'string',
            allowNull:true
        }
    },
    beforeCreate(val,callback){
        val.ten_san_pham_alias = val.ten_san_pham.replace(/ /g,'').toLowerCase();
        return callback();
    }

};

