require.config({
    waitSeconds:0,
    paths:{
        "util":CONST.cdnpath+"/Backstage/js/util"
    },
    shim: {
    },
});
define(["util"],function(util){
    let controller = CONST.successServer+'/zjzx-search/search';
    let service = {};
    let token = localStorage.getItem('token');
    let userid = localStorage.getItem('id');

    //保存关键字
    service.addSearchRecord = function(keyword,call){
        let params = {token, userid, keyword};
        util.ajax(controller+'/addSearchRecord',params,call);

    };

    //根据输入的关键字获取关键字列表
    service.getKeywordList = function(keyword,call){
        let params = {keyword};
        util.ajax(controller+'/getKeywordList',params,call);
    };

    //获取最热关键字
    service.getHotKeyword = function(call){
        let params = {};
        if (call) {
            util.ajax(controller+'/getHotKeyword',params,call);
            return;
        }
    };
    return service;
});




