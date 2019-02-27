require.config({
    waitSeconds:0,
    paths:{
        "util":CONST.cdnpath+"/Backstage/js/util"
    },
    shim: {
    },
});
define(["util"],function(util){
    let controller = CONST.successServer+'/zjzx-article/article_file';
    let service = {};
    let token = localStorage.getItem('token');
    let userid = localStorage.getItem('id');


    // 根据文章id获取附件信息
    service.getFileByArticle = function(articleid, call){
        let params = {articleid};
        if(!call){
            let resMap =util.ajaxAsync(controller+'/getFileByArticle',params);
            return resMap;
        }

        util.ajax(controller+'/getFileByArticle',params,function(data){
            call(data);
        });
    };``
    return service;
});




