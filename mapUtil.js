var mapUtil = {

};

/**
 * 加载地图
 */
mapUtil.load = function(call) {

	adaptHeight(); //动态适配高度

	window.onresize = function() { //横屏、QQ浏览器变全屏模式下的时候，需要重新计算高度              
		adaptHeight();
	}

	window.addEventListener('message', function(event) {
		var data = event.data;
	//	alert('你使用的组件是' + loc.module + ',刚选择了' + loc.poiname + ',它位于' + loc.poiaddress + ',它的经纬度是：' + loc.latlng.lat + ',' + loc.latlng.lng + ',所属城市为:' + loc.cityname)
		
		var resMap = {};
		resMap.publishaddresses = data.poiname
		resMap.latitude = data.latlng.lat;
		resMap.longitude = data.latlng.lng;
		resMap.publishstreet = data.poiaddress
		console.log(data);
		call(resMap);
		
	}, false);

	function adaptHeight() {
		var winH = $(window).height();
		var bodyH = document.documentElement.clientHeight;
		if(winH > bodyH) {
			window.parent.document.getElementById("iframe").height = winH;
		} else {
			window.parent.document.getElementById("iframe").height = bodyH;
		}
	}
}