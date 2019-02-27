


require.config({
    waitSeconds:0,
    paths:{
        "util":CONST.cdnpath+"/Backstage/js/util"
    },
    shim: {
    },
});
define(["util"],function(util){
    let controller = CONST.successServer+'/zjzx-article/article';
    let service = {};
    let token = localStorage.getItem('token');
    let userid = localStorage.getItem('id');

    /**
     * 获取文章列表
     */
    service.articlePage = function(page,size,keyword,state,call){
        let params = {
            page:page,
            size:size,
            keyword:keyword,
            state:state
        }
        if(!call){
            let resMap =util.ajaxAsync(controller+'/articlePage',params);
            return resMap;
        }

        util.ajax(controller+'/articlePage',params,function(data){
            call(data);
        });
    };

    /**
     * 文章删除
     */
    service.deleteArticleById = function(articleid){
        let params = {userid, token, articleid};
        let resDelete = util.ajaxAsync(controller+'/deleteArticleById',params);
        return resDelete;
    };
    /**
     * 文章审核
     */
    service.articleCheck = function(articleid,state,checknoreason,call){
        let params = {
            token,
            userid,
            articleid:articleid,
            state:state,
            checknoreason:checknoreason
        };
        if(!call) {
            let resMap = util.ajaxAsync(controller+'/articleCheck',params);
            return resMap;
        }
        util.ajax(controller+'/articleCheck',params,function (data) {
            call(data);
        });
    };

    /**
     * 文章发布
     */
    service.publishArticle = function(record,record_file) {
        let params = {
            userid,
            token,
            record:JSON.stringify(record),
            record_file:JSON.stringify(record_file)
        };
/*        if(record_file) {
            params.record_file = record_file;
        }*/

        let resMap = util.ajaxAsync(controller+'/publishArticle',params);
        return resMap;
    };
    return service;
});




