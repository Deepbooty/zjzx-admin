require.config({
	waitSeconds:0,
	paths:{
		"util":CONST.cdnpath+"/Backstage/js/util"
	},
	shim: {
    },
});
define(["util"],function(util){
	let controller = CONST.successServer+'/zjzx-user/user';
	let service = {};

    let token = localStorage.getItem('token');
    let userid = localStorage.getItem('id');
    let logid = localStorage.getItem('logid');
	
	/**
	 * 获取验证码
	 */
	service.getCode = function(mobile,call){
		let params ={
			mobile:mobile
		};
		if(!call){
			let resMap =util.ajaxAsync(controller+'/getCode',params);
			return resMap;
		}
		
		util.ajax(controller+'/getCode',params,function(data){
			call(data);
		});
	};

	/**
	 * 用户登录
	 * */

	service.loginByMobile=function(mobile, code, call) {
		let params = {
			mobile:mobile,
			code: code
		};

		if(!call) {
			let resMap = util.ajaxAsync(controller+'/loginByMobile', params);
			return resMap;
		}

		util.ajax(controller+'/loginByMobile', params, function(data) {
			call(data);
			console.log(data)
		});
	};

	/**
	*用户退出
	**/
	service.logOut = function (call) {
		let params = {
            logid,
			token,
            userid
		};
		if(!call) {
			let resMap = util.ajaxAsync(controller+'/logOut',params);
			return resMap;
		}
		util.ajax(controller+'/logOut',params,function (data) {
			call(data);
        });
    };
	
	// 获取用户信息
	service.getUserById = function (targetuserid, call) {
		let params = {
			userid,
			token,
			targetuserid
		};
		if(!call) {
			let resMap = util.ajaxAsync(controller+'/getUserById',params);
			return resMap;
		}
		util.ajax(controller+'/getUserById',params,function (data) {
			call(data);
		});
	};



	
	return service;
	
	
	
});




