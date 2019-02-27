require.config({
    waitSeconds:0,
    paths:{
        "util":CONST.cdnpath+"/Backstage/js/util"
    },
    shim: {
    },
});
define(["util"],function(util){
    let controller = CONST.server+"/messageCollect";
    let service ={};

    /**
    * 获取搜集的文章列表
    * */
    service.getArticleList = function (params,call) {
        if(!call) {
            let resMap = util.ajaxAsync(controller+"/getArticleList",params);
            return resMap;
        }
        util.ajax(controller+"/getArticleList",params,function (data) {
            call(data);
        })

    };
    /**
     * 删除采集的文章
     */
    service.deleteArticle = function(recordid,call){
        let params = {
            recordid:recordid
        };
        if(!call) {
            let resMap = util.ajaxAsync(controller+'/deleteArticle',params);
            return resMap;
        }
        util.ajax(controller+'/deleteArticle',params,function (data) {
            call(data);
        })
    };
    return service;
});