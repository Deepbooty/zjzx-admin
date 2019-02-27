const successServer = "http://212.64.1.189:8080/zjzxmanager";
const controller =successServer+'/user';
const util ={}
util.ajaxAsync = function(url,params){
	var res = null;
	$.ajax({
		url: url,
		type: 'post',
		dataType: 'json',
		data: params,
		async:false,
		success:function(data){
			res = data;
		}
	})
	return res;

}

const service={};

service.getCode = function(mobile,call){
	let params ={
		mobile:mobile
	}
	var resMap =	commonUtil.ajaxAsync(controller+'/getCode',params);
	return resMap;
}