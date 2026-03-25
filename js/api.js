// 全局的前缀
// var BASE_URL = "http://www.codeedu.com.cn"
// 如果是在本地运行（127.0.0.1），直接请求原接口
// 如果是在 Vercel 运行（域名包含 vercel.app），则请求 /api 代理
var BASE_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
               ? "http://www.codeedu.com.cn" 
               : "/api";
function baseAjax(type, url, data, callback,isToken) {
    var contentType = type == "GET" ? "application/x-www-form-urlencoded" : "application/json"
    // 判断token
    var headers = isToken?{Authorization:$.cookie("xiaomi-token")}:""
    // 判断是否有账号密码
    // if(Object.values(data).length>0){
    //     data = JSON.stringify(data)
    // }
    // 如果是 POST 并且 有数据，才封箱（转字符串）
    if (type.toUpperCase() !== "GET" && data && typeof data === 'object') {
        requestData = JSON.stringify(data);
    }
    $.ajax({
        type: type,
        url: BASE_URL + url,
        // 如果在这里转换字符串，有可能把空对象转成'{}'的字符串
        data: data,
        contentType,
        // 增强语法
        headers,
        success: function (res) {
            if (res.code == 200) callback(res)
        },
        error: function (err) {
            console.log(err);
        }
    })
}
/**
 * 为用户注册请求ajax的数据 的函数
 * @param {JSON} data 账号密码的值
 * @param {function} callback 回调函数
 */
function userRegister(data, callback) {
    baseAjax("POST", "/xiaomi/v1/ms/user/register", data, callback,false)
}
/**
 * 为用户登录请求ajax的数据 的函数
 * @param {JSON} data 账号密码的值
 * @param {function} callback 回调函数
 */
function userLogin(data, callback) {
    baseAjax("POST","/xiaomi/v1/ms/user/login",data,callback,false)
}
/**
 * 获取用户信息 的函数
 * @param {JSON} data 账号密码的值 为空//因为默认要已登录的用户可以查询
 * @param {function} callback 回调函数
 */
function userInfo(data,callback){
    baseAjax("GET","/xiaomi/v1/ms/user/info",data,callback,true)
}
/**
 * 获取轮播图信息 的函数
 * @param {JSON} data 
 * @param {function} callback 回调函数
 */
function getBanner(data,callback){
    baseAjax("GET","/xiaomi/v1/carousel",data,callback,false)
}
/**
 * 获取首页热门商品信息
 * @param {JSON} data 账号密码信息
 * @param {function} callback 回调函数
 */
function hotProduct(data,callback){
    baseAjax("GET","/xiaomi/v1/product/hot",data,callback,false)
}


/**
 * 查询商品详情
 */
function productDetailInfo(data,callback){
    var productId = data.productId
    // 删除对象属性，以免data再次拼接上去
    delete data.productId
    baseAjax("GET",`/xiaomi/v1/product/${productId}`,data,callback,false)
}
/**
 * 购买商品详情
 */
function buyProduct(data,callback){
    baseAjax("POST",`/xiaomi/v1/product/buy`,data,callback,true)
}
