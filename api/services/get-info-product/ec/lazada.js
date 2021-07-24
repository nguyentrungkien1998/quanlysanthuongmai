const request = require('request-promise');
const fs = require('fs');
const cheerio = require('cheerio');
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
const GetCategory = async (category_id,result = [])=>{
    
    let find_category = await Category.find({category_id,ec:'lazada'});
    if(find_category.length > 0){
        let {name,category_id,parent_id} = find_category[0];
        result.unshift({name,category_id});
        
        return await GetCategory(parent_id,result);
    }else{
        return result
    }
};
const GetDescription = async url=>{

    if(url){
        url = 'https:'+url;
    }else{
        return ''
    }
    let options = {
        url,
        method:'GET'
    };
    let responseText = await request(options);
    let {result:{components}} = JSON.parse(responseText);
    
    return components[Object.keys(components)[0]].moduleData.html;
};
module.exports = async function(url){
    if(!url){
        return null
    }
    var headers = {
        'authority': 'www.lazada.vn',
        'cache-control': 'max-age=0',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36 OPR/72.0.3815.320',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'sec-fetch-site': 'none',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-user': '?1',
        'sec-fetch-dest': 'document',
        'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en;q=0.6,en-US;q=0.5',
        'cookie': '_uab_collina=160489758102102607990153; __wpkreporterwid_=c22ae7f3-42f5-4460-8943-9cccd7e91375; XSRF-TOKEN=f1990057-0f73-42e3-b574-99cfa7f66d28; lzd_cid=dae8237f-b02f-48a0-926c-556940035214; lzd_sid=17658095bb0dcafffd87780b6eeee6d1; _tb_token_=e1e34db16b1e3; t_uid=25ed0156-64e4-4869-ac3a-9b9b822c217e; hng=VN|vi|VND|704; userLanguageML=vi; t_fv=1604897581458; cna=LbkvGCXXXFYCAXZGRB0sBMRp; _gcl_au=1.1.219871687.1604897582; _bl_uid=Cpkdthhzash2U2ldI1pbq5slXabk; _ga=GA1.2.974512613.1604897588; _fbp=fb.1.1604897588267.1270243655; _m_h5_tk=adffb5190a700097b3301756af941a83_1606281463675; _m_h5_tk_enc=7993400cac76a379f3d02880cc3325a4; JSESSIONID=9C7D45F612B16A91B45D5866B1EF12CB; __wpkreporterwid_=a5512c39-2e2c-4ec8-384c-5b56083ef2a0; xlly_s=1; _gid=GA1.2.479017926.1606578223; t_sid=DaMsrMYDVPSJSxwA2ETpRG7RIfZ54qK8; utm_channel=NA; _uetsid=7e93b0d0319011eb917a65161b5fc729; _uetvid=75eb0ea0224711eb9eaadf7ddce4614c; tfstk=c2nfBANh4fnydUTN0x9zQPTPdIZAa7IbUKNohqbwD6TGTgNgwsqFYWgSZAfJNoy5.; l=eB_0uBbnO6LhRg-kBO5Z-urza77OCLvXhiFzaNbMiIncC6edNYvZC7xQK9I4RKtRJWXcGCT24LTU30wtde0a8PM1i9vJUEuVtCkDBNC..; isg=BKWlmpBEFmc8wnJQ3BSIufwFpGff4ll0C7182qeADFxJvsswYDMLRe8USTrI-HEs'
    };

    var options = {
        url,
        headers
    };

    let html = await request(options);
   
    let text = FINDid(html,'app.run(','});')[0]+'}';
    let json = JSON.parse(text);
    let attributes = json.data.root.fields.productOption.skuBase.properties


    let itemId = json.data.root.fields.skuInfos['0'].itemId || '';
    let sellerId = json.data.root.fields.skuInfos['0'].sellerId || '';
    let ten_san_pham = json.data.root.fields.skuInfos['0'].dataLayer.pdt_name || '';

    let danh_muc = await GetCategory(json.data.root.fields.skuInfos['0'].categoryId);
    let ten_cua_hang = json.data.root.fields.skuInfos['0'].dataLayer.seller_name || '';
    let phan_tram = Math.abs(parseInt(json.data.root.fields.skuInfos['0'].price.discount)) || 0;
    let gia_cu = parseInt(json.data.root.fields.skuInfos['0'].price.originalPrice ? json.data.root.fields.skuInfos['0'].price.originalPrice.value : 0) || 0;
    let gia_moi = parseInt(json.data.root.fields.skuInfos['0'].price.salePrice.value) || 0;
    let so_luong = json.data.root.fields.skuInfos['0'].stock;
    let skuId = json.data.root.fields.skuInfos['0'].skuId || '';
    let link_san_pham = url.includes('?')?FINDid(url,'','?')[0]:url;
    let thuong_hieu = json.data.root.fields.product.brand.name || '';
   
    let mo_ta = json.data.root.fields.product.pageUrl ? await GetDescription(json.data.root.fields.product.pageUrl) : json.data.root.fields.product.highlights
    let rating = {
        score:json.data.root.fields.review.ratings.average,
        total:json.data.root.fields.review.ratings.rateCount
    };

    let so_luong_con_lai =  json.data.root.fields.skuInfos['0'].stock || null;
    let tong_so_luong = parseInt(FINDid(html,'"#FFFFFF","total":','}')[0]) || null;
    let so_luong_da_ban =  (tong_so_luong-so_luong_con_lai) || null;
    let doanh_thu_du_kien = gia_moi*tong_so_luong || null;
    let doanh_thu_dat_duoc = gia_moi*so_luong_da_ban || null;

    let link_shop = 'https://www.lazada.vn/shop/'+FINDid(html,'lazada.vn/shop/','/?')[0];
    let full_img_product = json.data.root.fields.skuGalleries['0'].map(e=>'https:'+e.poster+'_720x720q75.jpg');
    return {itemId,sellerId,skuId,ten_san_pham,danh_muc,mo_ta,so_luong_con_lai,so_luong_da_ban,tong_so_luong,doanh_thu_du_kien,doanh_thu_dat_duoc,rating,thuong_hieu,ten_cua_hang,phan_tram,gia_cu,gia_moi,link_shop,link_san_pham,full_img_product,ec:'lazada',attributes}


};