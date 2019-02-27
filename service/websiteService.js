require.config({
    waitSeconds:0,
    paths:{
        "util":CONST.cdnpath+"/Backstage/js/util"
    },
    shim: {
    },
});
define(["util"],function(util){
    let controller = CONST.successServer+'/zjzx-system/website';
    let service = {};
    let token = localStorage.getItem('token');
    let userid = localStorage.getItem('id');

    /**
     * 添加在线留言
     */
    service.saveOnlinemessage = function(membername,mobile,content){
        let params = {
            membername:membername,
            mobile:mobile,
            content:content
        };

        let resMap = util.ajaxAsync(controller+'/saveOnlinemessage',params);
        return resMap;
    };

    /**
     * 获取留言列表
     */
    service.getOnlinemessagePage = function(params,call){
        if(!call) {
            let resMap = util.ajaxAsync(controller+'/getOnlinemessagePage',params);
            return resMap;
        }
         util.ajax(controller+'/getOnlinemessagePage',params,function (data) {
            call(data);
        })
    };

    service.setInformation = function(title,content,imagepath,creatorid){
        let params = {
            title,
            content,
            imagepath,
            creatorid
        };
        let res = util.ajaxAsync(controller + '/setInformation',params)
    };


    /**
     * 获取资讯分页
     */
    service.getInformationPage = function(params,call){
        if(!call) {
            let resMap = util.ajaxAsync(controller+'/getInformationPage',params);
            return resMap;
        }
        util.ajax(controller+'/getInformationPage',params,function (data) {
            call(data);
        })
    };
    /**
     * 资讯删除
     */
    service.deleteInformation = function(recordid,call){
        let params = {
            recordid:recordid
        };
        if(!call) {
            let resMap = util.ajaxAsync(controller+'/deleteInformation',params);
            return resMap;
        }
        util.ajax(controller+'/deleteInInformation',params,function (data) {
            call(data);
        })
    };
    return service;
});