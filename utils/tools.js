// 工具函数

/**
 * 解析地址栏的参数并且获取指定的数据
 * @param {*} key 参数的键名
 * @returns 
 */
function getSearch(key) {
    var obj={}
    window
    .decodeURI(location.search)
    .slice(1, location.search.length)
    .split("&")
    .forEach(function (item) {
        var keyValue = item.split("=")
        var key = keyValue[0]
        var value = keyValue[1]
        obj[key] = value
    })
    return obj[key]
}