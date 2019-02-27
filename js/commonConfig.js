
const CONST={
		// server:"http://47.101.58.43:8185",
		successServer:"http://www.zjzx.xyz:9091",
		cdnpath:"http://localhost:8888",
		//cdnpath:"http://47.101.58.43:8888",
		fileServer:"http://47.101.58.43:8081",
		fileRoot:"http://47.101.58.43:8085",
};


/**
 * 动态加载JS
 * @param {string} url 脚本地址
 * @param {function} callback  回调函数
 */
function dynamicLoadJs() {
	document.write('<script src="'+CONST.cdnpath+'/Backstage/js/jquery.js"  type="text/javascript"></script>');
	document.write('<script src="'+CONST.cdnpath+'/Backstage/js/bootstrap.min.js"  type="text/javascript"></script>');
	document.write('<script src="'+CONST.cdnpath+'/Backstage/layui/layui.all.js"  type="text/javascript"></script>');
	document.write('<script src="'+CONST.cdnpath+'/Backstage/js/require.js"  type="text/javascript"></script>');
}

dynamicLoadJs();
