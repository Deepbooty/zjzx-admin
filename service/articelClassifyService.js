
require.config({
    waitSeconds:0,
    paths:{
        "util":CONST.cdnpath+"/Backstage/js/util"
    },
    shim: {
    },
});
define(["util"],function(util){
    let controller = CONST.successServer+'/zjzx-article/article_classify';
    let service = {};
    let token = localStorage.getItem('token');
    let userid = localStorage.getItem('id');

    service.getArticleClassifyList = function (call) {
      let params ={};
      if(!call) {
          let resMap = util.ajaxAsync(controller+'/getArticleClassifyList',params);
          return resMap;
      }
      util.ajax(controller+'/getArticleClassifyList',params,function (data) {
          call(data);
      })
    };
    return service;
});




