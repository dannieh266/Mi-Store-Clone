/**
 * 初始化轮播图
 */
function initBanner() {
    var curIndex = 0, imgTotal = 4, bannerTimer
    // 获取数据，渲染在页面上
    getBanner({}, function (res) {
        imgTotal = res.data.length
        res.data.forEach(function (ele, index) {
            $(".img-train").append(`<img src="${BASE_URL}/${ele.url}" alt="">`)
            // 因为有多少张图片就有多少个小圆点
            // 初始化小圆点，小圆点激活样式方式一
            $(".dot").append(`
                <div class="dot-item ${index == 0 ? 'dot-active' : ''}"></div>
            `)
        });
        // 小圆点激活样式方式二
        // $(".dot-item").eq(0).addClass("dot-active")
        buildBannerChange(imgTotal)
        buildBannerBotChange()
        bannerTimer = setInterval(function () {
            loop(imgTotal)
        }, 3000)

    })
    /**
     * 轮播图自动轮播功能
     */
    function loop(bannerLength) {
        curIndex = curIndex == bannerLength - 1 ? 0 : ++curIndex
        $(".img-train").css("transform", `translateX(-${curIndex * 1215}px)`)
        $(".dot .dot-item").eq(curIndex).addClass("dot-active").siblings().removeClass("dot-active")
    }
    /**
     * 构建轮播图的点击功能
     */
    function buildBannerChange(total) {
        // 点击下一张
        $(".arrow-right").on("click", function () {
            clearInterval(bannerTimer)
            curIndex = curIndex == total - 1 ? 0 : ++curIndex
            changeBannerDot(curIndex)
            bannerTimer = setInterval(function () {
                loop(imgTotal)
            }, 3000)
        })
        // 点击上一张
        $(".arrow-left").on("click", function () {
            clearInterval(bannerTimer)
            curIndex = curIndex == 0 ? total - 1 : --curIndex
            changeBannerDot(curIndex)
            bannerTimer = setInterval(function () {
                loop(imgTotal)
            }, 3000)
        })
    }
    /**
     * 圆点点击时，切换轮播图
     */
    function buildBannerBotChange() {
        // 事件委托
        $('.dot').on('click', '.dot-item', function () {
            clearInterval(bannerTimer)
            curIndex = $(this).index()
            changeBannerDot($(this).index())
            bannerTimer = setInterval(function () {
                loop(imgTotal)
            }, 3000)
        })
    }
    /**
     * 封装切换图片过程
     * @param {int} index 当前被点击（激活）的下标
     */
    function changeBannerDot(index) {
        $(".img-train").css("transform", `translateX(-${index * 1215}px)`)
        $(".dot .dot-item").eq(index).addClass("dot-active").siblings().removeClass("dot-active")
    }
}



/**
 * 初始化商品
 */
function initProduct() {
    hotProduct({}, function (res) {
        // 渲染第一部分商品 手机
        buildPhoneProduct(res.rows[0])
        // 渲染第二部分商品 家电
        buildHouseholdProduct(res.rows[1])
        // 渲染第三部分 配件
        buildAttachmentProduct(res.rows[2])
    })
    // 渲染配件
    function buildAttachmentProduct(data) {
        renderGoods(".attachment-product", data)
    }
    // 渲染家电
    function buildHouseholdProduct(data) {
        renderGoods(".household-product", data)
    }
    // 渲染手机商品
    function buildPhoneProduct(data) {
        renderGoods(".cellphone-product", data)
    }


    /**
     * 各类商品封装渲染步骤
     * @param {String} selector 需要被处理的选择器
     * @param {JSON} data 需要被渲染的数据
     */
    function renderGoods(selector, data) {
        // 渲染标题
        $(`${selector + " .title"}`).text(data.categoryName)
        // 渲染左侧
        if (data.categoryPicture2 == undefined) {
            // 左侧只有海报的情况
            $(`${selector} .product-left`).append(`
                <img src="${BASE_URL}/${data.categoryPicture1}" alt="" class="big-img">
            `)
        } else {
            // 左侧有两张图的情况
            $(`${selector} .product-left`).append(`
                <img src="${BASE_URL}/${data.categoryPicture1}" alt="" class="normal-img">
                <img src="${BASE_URL}/${data.categoryPicture2}" alt="" class="normal-img">
            `)
        }
        // 渲染右边卡片
        var productList = data.products
        productList.forEach(function (item) {
            var productCardNode = $(`
                <div class="product-item">
                    <div class="product-img">
                        <img src="${BASE_URL}/${item.productPicture}" alt="">
                    </div>
                    <div class="product-name">${item.productName}</div>
                    <div class="product-introduce">${item.productTitle}</div>
                    <div class="price">
                        <span>${item.productSellingPrice}元</span>
                        <span>${item.productPrice == item.productSellingPrice ? '' : item.productPrice + '元'}</span>
                    </div>
                </div>
            `)
            // 缓存商品的id值
            productCardNode.data("productId", item.productId)
            $(`${selector} .product-right`).append(productCardNode)

            // 由于卡片是动态渲染的，所以
            // 事件委托实现跳转
            $(`${selector} .product-right`).on("click", ".product-item", function () {
                console.log($(this).data("productId"));
                if ($(this).data("productId") !== undefined) {
                    location.href = `./details.html?productId=${$(this).data("productId")}`
                } 
            })
        })
        $(`${selector} .product-right`).append(`
            <div class="product-item">
                浏览更多>>
            </div>
        `)
    }

}

// 入口函数 文档加载完后自动调用
$(function () {
    userInfo({}, function (res) {
        console.log(res);
    })
    // 渲染轮播图部分
    initBanner()
    // 渲染商品部分
    initProduct()


})