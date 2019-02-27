require.config({
    waitSeconds:0,
    paths:{
        "util":CONST.cdnpath+"/Backstage/js/util"
    },
    shim: {
    },
});
define(["util"],function(util){
    let controller = CONST.fileServer+'/file';
    let service = {};
    let token = localStorage.getItem('token');
    let userid = localStorage.getItem('id');


    // 上传头像
    service.uploadHeadImage = function(params,call){
        ajaxFile(controller+'/uploadHeadImage',params,call);
    };
    // 上传图片
    service.uploadPic = function(params,call){
        ajaxFile(controller+'/uploadPic',params,call);
    };
    // 上传视频
    service.uploadVideo = function(params,call){
        ajaxFile(controller+'/uploadVideo',params,call);
    };
    function ajaxFile (url,params,call) {
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: params,
            async:true,
            processData:false,
            contentType:false,
            success:function(res){
                call(res);
            }
        })
    }
    return service;
});




