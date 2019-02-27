

require.config({
    waitSeconds:0,
    paths:{

    },
    shim: {
    },
});
define([],function(){
    //手机号识别并返回
    let isPhoneNumber=function(num) {
        if (!num) { return false };
        let str = num.toString();
        let val = str.replace(/[^0-9]/ig, "");
        if (val.length !== 11) { return false };
        var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1})|)+\d{8})$/;
        if (!myreg.test(val)) { return false } else { return val }
    };
    //给号码加上空格
    let mobileInput=function(num){
        if (!num) { return };
        let newMobile = num.replace(/[^0-9]/g, '');
        let str = newMobile.toString()
        let L = str.length;
        let mobile = num;
        if (L <= 3) {
            mobile = newMobile;
        } else if (L > 3 && L <= 7) {
            mobile = str.substring(0, 3) + ' ' + str.substring(3, 7)
        } else if (L > 7 && L <= 11) {
            mobile = str.substring(0, 3) + ' ' + str.substring(3, 7) + ' ' + str.substring(7, 11);
        }
    };

    //输入区内容合法验证
    let checkInput = function(val){
        val = String(val);
        let reg = /(script|href|on|iframe|frameset)/gi;
        return !reg.test(val); //合法返回true
    };

    // 非法字符替换
    let replaceNo = function(val){
        let reg = /(script|href|on|iframe|frameset)/gi;
        return String(val).replace(reg,""); //返回替换后合法的字串
    };


    let tool = {isPhoneNumber, mobileInput,checkInput,replaceNo};
    return tool;

});




