require.config({
	waitSeconds:0,
	paths:{
	},
	shim: {
    },
});
define([],function(){
	var util = {
			ajaxAsync:function(url,data){
			        var jsondata=null;
			        $.ajax({
			            url: url,
			            type: "post",
			            async: false,
			            data: data,
			            success: function (data) {
			                jsondata=data;
			            }
			        });
			        return jsondata;
			    },
			    lockScroll:function(ele){
			    	ele.css("overflow","hidden");
			    },
			    unLockScroll:function(ele){
			    	ele.css("overflow","scroll");
			    },
			    getParam: function GetQueryString(key) {
			        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
			        var r = parent.window.location.search.substr(1).match(reg);
			        if(r==null){
			        	r = window.location.search.substr(1).match(reg);
			        }
			        //decodeURIComponent为url中的中文转码
			        if (r != null) return unescape(decodeURIComponent(decodeURIComponent(r[2])));
			        return null;
			    },
			    testHtml:function(res){
			    	if(!$.trim(res)){
			    		return false;
			    	}
			    	var text = $(res).text();
			    	if(!$.trim(text)){
			    		return false;
			    	}
			    	return true;
			    }
	};
	
	

	$(function(){
		
	});
	
	util.ajax = function(url,params,call){
		$.post(url,params,call);
	};
	
	return util;
	
});