/**
 * 用来控制弹窗的显示和隐藏
 * @param {String} selector css选择器，用于控制显隐的目标
 * @param {Boolean} visible 实现控制弹窗的显示or隐藏
 */
function dialogVisible(selector, visible) {
    $(selector).css("display", visible ? "block" : "")
    if (visible == false) {
        $(".err-msg").text("")
        $(".input-info input").val("")
        $(".input-info").css("border", "1px solid #DCDFE6")
    }
}


/**
 * 处理注册事件，通过validForm()函数校验后请求ajax获取数据
 */
function handleRegister() {
    var accountValid = validForm(".register-dialog .input-info input[name='account']", {
        required: true,
        msg: "请输入账号",
        reg: /^[a-zA-z]{1}[a-zA-z0-9_]{4,16}$/,
        regMsg: "字母开头，长度5-16之间，允许字母数字和下划线"
    })
    var pwdValid = validForm(".register-dialog .input-info input[name='pwd']", {
        required: true,
        msg: "请输入密码",
        reg: /^[a-zA-z]{1}[a-zA-z0-9_]{5,17}$/,
        regMsg: "字母开头，长度6-18之间，允许字母数字和下划线"
    })
    var pwdRepeat = validForm(".register-dialog .input-info input[name='pwdRepeat']", {
        required: true,
        msg: "请再次输入密码",
        reg: /^[a-zA-z]{1}[a-zA-z0-9_]{5,17}$/,
        regMsg: "两次输入的密码不一致",
        // 自定义校验，之所以让调用者传值是因为要先进行其他校验，再进行这个步骤，更严谨
        // 且在调用validForm的时候本身需要一个返回值，这个也作为一个判断步骤（错了就false）放进去了
        validator: function (rePassword) {
            console.log("进行自定义校验");
            var passwordValue = $(".register-dialog .input-info input[name='pwd")
            return passwordValue.val() == rePassword ? "" : "两次输入的密码不一致"
        }
    })
    if (accountValid && pwdValid && pwdRepeat) {
        userRegister({
            password: $(".register-dialog .input-info input[name='pwd']").val(),
            username: $(".register-dialog .input-info input[name='account']").val()
        }, function (res) {
            // 把结果返回给用户
            alert(res.msg)

            // 关闭弹窗
            $(".register-dialog").css("display", "none")
            // 清空错误提示和文本内容
            $(".err-msg").text("")
            $(".input-info input").val("")
            $(".input-info").css("border", "1px solid #DCDFE6")
        })
    }
}
/**
 * 处理登录事件，通过validForm()函数校验后请求ajax获取数据
 */
function handleLogin() {
    var accountValid = validForm(".login-dialog .input-info input[name='account']", {
        required: true,
        msg: "请输入账号",
        reg: /^[a-zA-z]{1}[a-zA-z0-9_]{4,16}$/,
        regMsg: "字母开头，长度5-16之间，允许字母数字和下划线"
    })
    var pwdValid = validForm(".login-dialog .input-info input[name='pwd']", {
        required: true,
        msg: "请输入密码",
        reg: /^[a-zA-z]{1}[a-zA-z0-9_]{5,17}$/,
        regMsg: "字母开头，长度6-18之间，允许字母数字和下划线"
    })
    if (accountValid && pwdValid) {
        userLogin({
            password: $(".login-dialog .input-info input[name='pwd']").val(),
            username: $(".login-dialog .input-info input[name='account']").val()
        }, function (res) {
            // 结果返回给用户
            alert(res.msg)
            // 登陆成功保存token
            $.cookie("xiaomi-token", res.data)

            // 关闭弹窗
            $(".login-dialog").css("display", "none")
            // 清空错误提示和文本内容
            $(".err-msg").text("")
            $(".input-info input").val("")
            $(".input-info").css("border", "1px solid #DCDFE6")
        })
    }
}


/**
 * 用于校验传入的input数据是否符合规则
 * @param {String} inputSelector 输入框的控制器
 * @param {JSON} rule 输入框的规则及报错信息
 * @returns 
 */
function validForm(inputSelector, rule) {
    // 获取输入框的值
    inputText = $(inputSelector).val()
    // 获取提示框的值
    var errMsg = $(inputSelector).siblings(".err-msg")
    if (rule.required && inputText.length == 0) {
        errMsg.text(rule.msg)
        $(inputSelector).parent().css("border", "1px solid red")
        return false
    }
    if (!rule.reg.test(inputText)) {
        errMsg.text(rule.regMsg)
        $(inputSelector).parent().css("border", "1px solid red")
        return false
    }
    if (typeof rule.validator == "function") {
        errMsg.text(rule.regMsg)
        var result = rule.validator(inputText)
        if (result.length > 0) {
            errMsg.text(result)
            $(inputSelector).parent().css("border", "1px solid red")
            return false
        }

    }
    // 校验成功，清空提示
    errMsg.text("")
    $(inputSelector).parent().css("border", "1px solid #DCDFE6")
    return true
}