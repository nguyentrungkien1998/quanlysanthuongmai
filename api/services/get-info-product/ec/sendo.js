const request = require('request-promise');
function sanitize_for_regex(s){
    var escaped = '';
    for(var i = 0; i < s.length; ++i){
        switch(s[i]){
            case '{':
            case '}':
            case '[':
            case ']':
            case '-':
            case '/':
            case '\\':
            case '(':
            case ')':
            case '*':
            case '+':
            case '?':
            case '.':
            case '^':
            case '$':
            case '|':
                escaped+= '\\';
            default:
                escaped+= s[i];
        }
    }
    return escaped;
}
function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|`|-|{|}|\||\\/g," ");
    str = str.replace(/ + /g," ");

    str = str.trim().toLowerCase(); 
    return str.replace(/ /g,'-');
};

let FINDid = (text,startS,lastS)=>{
    startS = sanitize_for_regex(startS);
    lastS = sanitize_for_regex(lastS);
    let myRegEx = new RegExp('(?<='+startS+').*?(?='+lastS+')', 'gi');
    if(text.match(myRegEx)){
        return [...new Set(text.match(myRegEx))]
    }else{
        return []
    }
};
module.exports = async function(url){
    if(!url){
        return null
    }
    let link_san_pham = url;
    url = 'https://www.sendo.vn/m/wap_v2/full/san-pham/'+FINDid(url,'https://www.sendo.vn/','.html')[0]+'?platform=wap';
    let options = {
        url,
        method : 'get',
        headers : {
            'user-agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36',

        }
    };
    
    let text = await request(options);
    let {result:{data}} = JSON.parse(text);
    let {id,name,sku_user,shop_info,rating_info,category_info,price,description,final_price,promotion_percent,media,brand_info,total_comment,quantity,order_count,attribute} = data;
    let {shop_id,shop_name} = shop_info;
    let {total_rated,percent_number} = rating_info;


    let itemId = id.toString();
    let ten_san_pham = name || '';
    let danh_muc = category_info.map(({id,title})=>({category_id:id,name:title}))
    let ten_cua_hang = shop_name || '';
    let phan_tram = parseInt(promotion_percent) || 0;
    let gia_cu = parseInt(price) || 0;
    let gia_moi = parseInt(final_price) || 0;
    let mo_ta = description || '';
    let skuId = sku_user || '';
    
    let thuong_hieu = brand_info.name || '';
    let rating = {
        score:(parseFloat(percent_number) || 0)*0.05,
        total:parseInt(total_rated) || 0
    };

    let so_luong_con_lai = parseInt(quantity) || null;
    let so_luong_da_ban = parseInt(order_count) || 0;
    let tong_so_luong = so_luong_con_lai+so_luong_da_ban || null;
    let doanh_thu_du_kien = gia_moi*tong_so_luong || null;
    let doanh_thu_dat_duoc = gia_moi*so_luong_da_ban || null;

    let link_shop = 'https://www.sendo.vn/'+shop_info.shop_url
    let full_img_product = media.map(e=>e.image);

    return {itemId,skuId,ten_san_pham,danh_muc,mo_ta,so_luong_con_lai,so_luong_da_ban,tong_so_luong,doanh_thu_du_kien,doanh_thu_dat_duoc,rating,thuong_hieu,ten_cua_hang,phan_tram,gia_cu,gia_moi,link_shop,link_san_pham,full_img_product,ec:'sendo',attributes:attribute}

};