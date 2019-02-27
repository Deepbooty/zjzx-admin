require.config({
    waitSeconds:0,
    shim:{
        
    }
});
define([],function () {
    let util = {};
    /**
    * 数组拼接
    * @param mainList  原始数组
    * @param targetList 被拼接的数组
    */
    util.appendList = function(mainList, targetList) {
        mainList.push.apply(mainList, targetList);
    };
    /**
    * 异步设置列表属性
    * @param array
    * @param call
    **/
    util.asyncSetListPropty = function(array,call) {
        if(!array || array.size<=0) {
            return;
        }
        for(let i =0; i < array.length; i++) {
            excute(call,array[i]);
        }
    };
    /*清除数组所有元素*/
    util.emptyList = function(allList) {
        allList.splice(0,allList.length);
    };

    /**
    * 更具数组中对象的某个属性删除
    * @param list      目标数组
    * @param propty    属性名称
    * @param values    属性值 []
    */
    util.deleteByPropty = function(list,propty,values) {
        if(!value || values.length<=0){
            return list;
        }
        let newArray = [];
        for(let i =0; i<list.length;i++) {
            let item = list[i];
            if($.inArray(item[propty],values)<0){
                newArray.push(item);
            }
        }
        return newArray;
    };

    /**
    * 根据分页大小获取 page
    * @param list
    * @param size
    */

    util.getPageNumBySize = function(list,size) {
        let pageNum = 1;
        if(list.length%size == 0) {
            pageNum = list.length/size;
        }else {
            pageNum = (list.length/size)+1;
        }
        pageNum = pageNum<=0?1:pageNum;
        pageNum = parseInt(pageNum);
        return pageNum;
    };

    function excute(call, obj) {
        setTimeout(()=>{
            call(obj);
        },50);
    }
    return util;
});










