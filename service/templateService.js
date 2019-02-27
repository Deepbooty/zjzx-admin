


require.config({
    waitSeconds:0,
    paths:{
        "util":CONST.cdnpath+"/Backstage/js/util"
    },
    shim: {
    },
});
define(["util"],function(util){
    let controller = CONST.successServer+'/zjzx-system/template';
    let service = {};
    let token = localStorage.getItem('token');
    let userid = localStorage.getItem('id');

    /**
     * 模板保存
     */
    service.saveTemplate = function(record,call){
    // service.saveTemplate = function(title,discription,content,type,call){
    //     let record ={
    //         title:title,
    //         discription:discription,
    //         content:content,
    //         type:type
    //     }
        let params = {
            token,
            userid,
            record:JSON.stringify(record)
        };
        if(!call) {
            let resMap = util.ajaxAsync(controller+'/saveTemplate',params);
            return resMap;
        }
        util.ajax(controller+'/saveTemplate',params,function (data) {
            call(data);
        })
    };

    /**
     * 获取模板列表
     */
    service.templatePage = function(params,call){
        params.userid = userid;
        if(!call) {
            let resMap = util.ajaxAsync(controller+'/templatePage',params);
            return resMap;
        }
        util.ajax(controller+'/templatePage',params,function (data) {
            call(data);
        })
    };

    /**
     * 获取模板详情
     */
    service.getTemplateById = function(recordid,call){
        let params = {
            recordid:recordid
        };
        if(!call) {
            let resMap = util.ajaxAsync(controller+'/getTemplateById',params);
            return resMap;
        }
        util.ajax(controller+'/getTemplateById',params,function (data) {
            call(data);
        })
    };

    /**
     * 删除模板
     */
    service.deleteTemplate = function(recordid,call){
        let params = {
            recordid:recordid
        };
        if(!call) {
            let resMap = util.ajaxAsync(controller+'/deleteTemplate',params);
            return resMap;
        }
        util.ajax(controller+'/deleteTemplate',params,function (data) {
            call(data);
        })
    };


    return service;
});




