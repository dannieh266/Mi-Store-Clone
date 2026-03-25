/**
 * 构建商品详情页
 */
function buildDetailsInfo() {
    productDetailInfo({ productId: Number(getSearch('productId')) }, function (res) {
        // 构建商品轮播图
        initBanner(res.data.pictures)
        // 构建页面其他信息
        $(".basic-info .product-name").text(`${res.data.productName}`)
        $(".above").append(`
            <div class="name">${res.data.productName}</div>
            <div class="detail">${res.data.productIntro}
            </div>
            <div class="shop">小米自营</div>
            <div class="price">
                <span>${res.data.productSellingPrice}元</span>
                <span>${res.data.productPrice == res.data.productSellingPrice ? "" : res.data.productPrice + "元"}</span>
            </div>
        `)
        $(".order").append(`
            <div class="line-one layout-justify-between">
            <div class="order-name">${res.data.productName}</div>
            <div class="order-price">
                <span>${res.data.productSellingPrice}元</span>
                <span>${res.data.productPrice == res.data.productSellingPrice ? "" : res.data.productPrice + "元"}</span>
            </div>
            </div>
            <div class="line-two">总计：${res.data.productSellingPrice}元</div>
        `)
    })
}

// 购买商品
function buy() {
    if (!$.cookie("xiaomi-token")) {
        alert("请先登录！")
    } else {
        buyProduct({ productId: Number(getSearch('productId')) }, function (res) {
            console.log(res);
            if (res.code == 200) { 
                $(".buy-box").css("display","block")
            }
        })
    }
}

function buySuccess(){
    $(".buy-box").css("display","none")
}

/**
 * 初始化轮播图
 */
function initBanner(data) {
    var curIndex = 0, bannerTimer
    data.forEach(function (ele) {
        // 渲染图片
        $(".banner-img").append(`
            <img src="${BASE_URL}/${ele.productPicture}" alt="">
        `)
        // 渲染小圆点，并激活第一个小圆点
        $(".dot").append(`
            <div class="dot-item"></div>
        `)
        $(".dot div").eq(0).addClass("dot-active")

    });
    // 构建点击事件
    buildBannerChange(data.length)
    // 构建原点点击事件
    buildBannerBotChange()
    // 轮播图的自动轮播功能
    bannerTimer = setInterval(function () {
        loop(data.length)
    }, 3000)


    // 轮播图的自动轮播功能
    function loop(bannerLength) {
        curIndex = curIndex == bannerLength - 1 ? 0 : ++curIndex
        bannerMove(curIndex)
    }

    function buildBannerChange(total) {
        // 点击下一张
        $(".arrow-right").on("click", function () {
            clearInterval(bannerTimer)
            curIndex = curIndex == total - 1 ? 0 : ++curIndex
            bannerMove(curIndex)
            bannerTimer = setInterval(function () {
                loop(data.length)
            }, 3000)
        })
        // 点击上一张
        $(".arrow-left").on("click", function () {
            clearInterval(bannerTimer)
            curIndex = curIndex == 0 ? total - 1 : --curIndex
            bannerMove(curIndex)
            bannerTimer = setInterval(function () {
                loop(data.length)
            }, 3000)
        })
    }

    // 构建原点点击事件
    function buildBannerBotChange() {
        // 事件委托
        $(".dot").on("click", ".dot-item", function () {
            clearInterval(bannerTimer)
            curIndex = $(this).index()
            bannerMove(curIndex)
            bannerTimer = setInterval(function () {
                loop(data.length)
            }, 3000)
        })
    }

    // 轮播图动起来的相关变化构建
    function bannerMove(index) {
        $(".banner-img").css("transform", `translateX(-${index * 518}px)`)
        $(".dot div").eq(index).addClass("dot-active").siblings().removeClass("dot-active")
    }
}   

$(function () {
    buildDetailsInfo()
})