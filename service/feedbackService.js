
require.config({
    waitSeconds:0,
    paths:{
        "util":CONST.cdnpath+"/Backstage/js/util"
    },
    shim: {
    },
});
define(["util"],function(util){
    let controller = CONST.successServer+'/zjzx-system/feedback';
    let service = {};
    let token = localStorage.getItem('token');
    let userid = localStorage.getItem('id');

    /**
     * 获取模板列表
     */
    service.getFeedBackPage = function(params,call){
        params.userid = userid;
        if(!call) {
            let resMap = util.ajaxAsync(controller+'/getFeedBackPage',params);
            return resMap;
        }
        util.ajax(controller+'/getFeedBackPage',params,function (data) {
            call(data);
        })
    };

    /**
     * 获取反馈图片
     */
    service.getFeedImage = function(record,call){
        let params = {
            recordid:record.id
        };
        if(!call) {
            let resMap = util.ajaxAsync(controller+'/getFeedImage',params);
            return resMap;
        }
        util.ajax(controller+'/getFeedImage',params,function (data) {
            call(record,data);
        })
    };

    /**
    * 反馈回复
    */
    service.reply = function(params,call){
        params.userid = userid;
        if(!call) {
            let resMap = util.ajaxAsync(controller+'/reply',params);
            return resMap;
        }
        util.ajax(controller+'/reply',params,function (data) {
            call(data);
        })
    };

    return service;
});




