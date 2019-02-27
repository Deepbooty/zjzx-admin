
require.config({
    waitSeconds:0,
    paths:{
        "util":CONST.cdnpath+"/Backstage/js/util",
        "Vue":CONST.cdnpath+"/Backstage/js/vue.min"
    },
    shim: {
    }
});
define(["util","Vue"],function(util,Vue){
	var templateUrl =CONST.cdnpath +"/Backstage/pages/articelRelease/publish_dialog/publish_dialog.html";
	
	var page = {};
	
	/**
	 * 页面加载调用的函数
	 */
	
	var vm = null;
	page.onLoad = function(){
		vm = new Vue({
			el:page.el,
			data:{
				dialogShow:true,
				title:page.param.title,
				record:page.param.record,
				error:page.param.error
			},
			methods:{
				cancel:function(){
					vm.dialogShow = false;
				},
				sure:function(){
					var resMap = {
							record:vm.record
					};
					page.call(resMap);
					vm.dialogShow = false;
				}
			}
		});
		
		
	};
	
	var dialog = {
		/**
		 * 打开
		 * @param el
		 * @param param
		 */	
		open:function(el,param,call){
			
			page.el = el;
			page.body = $(el);
			page.param = param;
			page.call = call;
			if(!page.template){
				page.template =  util.ajaxAsync(templateUrl,{});
			}
			page.body.html(page.template);
			page.onLoad();
			
		}	
	};
	
	return dialog;
	
});





