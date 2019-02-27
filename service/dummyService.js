require.config({
    waitSeconds:0,
    paths:{
        "util":CONST.cdnpath+"/Backstage/js/util"
    },
    shim: {
    },
});
define(["util"],function(util){
    let controller = "http://wx.zjzx.xyz/zjzx-fictitious-user/user";
    let service = {};
    let token = localStorage.getItem('token');
    let userid = localStorage.getItem('id');
    service.getRandomChildUser = function (call) {
        let params ={userid};
        if(!call) {
            let resMap = util.ajaxAsync(controller+'/getRandomChildUser',params);
            return resMap;
        }
        util.ajax(controller+'/getRandomChildUser',params,function (data) {
            call(data);
        })
    };
    return service;
});




