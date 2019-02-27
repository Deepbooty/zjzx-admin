
require.config({
    waitSeconds:0,
    paths:{
        "util":CONST.cdnpath+"/Backstage/js/util",
        "Vue":CONST.cdnpath+"/Backstage/js/vue.min",
        "Vuex":CONST.cdnpath+"/Backstage/js/vuex.min",
        "Store":CONST.cdnpath+"/Backstage/store/index",
        "mapUtil":CONST.cdnpath+"/Backstage/util/mapUtil",
        "articelClassifyService":CONST.cdnpath+"/Backstage/service/articelClassifyService",
        "articelService":CONST.cdnpath+"/Backstage/service/articelService",
        "userService":CONST.cdnpath+"/Backstage/service/userService",
        "dummyService":CONST.cdnpath+"/Backstage/service/dummyService",
        "fileService":CONST.cdnpath+"/Backstage/service/fileService",
    },
    shim: {
    }
});
define(["util","Vue","Vuex","Store","mapUtil","articelClassifyService","articelService","userService","dummyService","fileService"],function(util,Vue,Vuex,Store,mapUtil,articelClassifyService,articelService,userService,dummyService,fileService){
    var templateUrl =CONST.cdnpath +"/Backstage/pages/articelManager/video_dialog/video_dialog.html";
    var page = {};

    /**
     * 页面加载调用的函数
     */
    var vm = null;
    page.onLoad = function(){
        vm = new Vue({
            el:page.el,
            data:{
                classfyList:[],
                weightList:[0,1,2,3,4,5,6,7,8,9,10],
                title:page.param.title,
                record:page.param.record,
                videoShow:true,
                randomUsername:"",
                randomId:null,
                fileRoot:CONST.fileRoot + '/',
                record_file:[],
                addShow:true

            },
            mounted(){
                this.$nextTick(()=>{
                    // 获取随机名
                    random();
                    this.record.weight = 0;
                    /*获取classify文章类型接口*/
                    let classifyData = articelClassifyService.getArticleClassifyList();
                    vm.classfyList = classifyData.result.classfyList;

                    // 发布地区
                    mapUtil.getPosition((data)=>{
                        this.record.citycode = data.citycode;
                        this.record.latitude = data.latitude;
                        this.record.longitude = data.longitude;
                        this.record.poiname = data.poiname;
                        this.record.publishaddresses = data.publishaddresses;
                        this.record.publisharea = data.publisharea;
                        this.record.publishcity = data.publishcity;
                        this.record.publishprovince = data.publishprovince;
                        this.record.publishstreet = data.publishstreet;
                        this.record.streetnum = data.streetnum;
                    });
                });


            },
            directives:{
                focus: {
                    inserted: function(el) {
                        el.focus();
                    }
                }
            },
            methods:{
                // 获取随机名
                handleRandom(){
                    random();
                },
                // 发布文章
                handlePublish(){
                    let token = localStorage.getItem('token');
                    if(!token){
                        layer.confirm('请先登录！', {
                            btn: ['重新登录','取消'] //按钮
                        }, ()=>{
                            window.parent.frames.location.href = CONST.cdnpath+"/Backstage/pages/login/login.html"
                        });
                        return;
                    }
                    if(!vm.record.title) {
                        layer.tips('视频标题输入有误，请重新输入', '#titleTips');
                        return false;
                    }
                    else if(!vm.record.classify) {
                        layer.tips('视频分类选择有误，请重新选择','#classifyTips');
                        return false;
                    }
                    else if(vm.record_file.length == 0){
                        layer.tips('请先上传视频','#videoTips');
                        return false;
                    }
                    else{
                        loadPublish();
                    }
                },
                handleCancel(){
                    vm.videoShow = false;
                },
                // 上传视频
                uploadFile(e){
                    let file = e.target.files[0];
                    let param = new FormData();
                    layer.msg('正在上传中...请稍后', {
                        icon: 16,shade: 0.01
                    });
                    param.append('file',file,file.name);
                    fileService.uploadVideo(param, (data)=>{
                        console.log(data)
                        let obj = {};
                        obj.url = data.result.url;
                        obj.filename = data.result.filename;
                        obj.type = 2;
                        obj.thumbnail = data.thumbnail;
                        vm.record_file.push(obj);
                        vm.addShow = false;
                        layer.msg('上传成功', {icon: 1});
                    });
                },
                handleRemoveThumbnail(item){
                    layer.confirm('确认删除？', {
                        btn: ['确定','取消'] //按钮
                    }, function(){
                        vm.record_file.splice(item,1);
                        layer.msg('删除成功', {icon: 1});
                        vm.addShow = true;
                    }, function(){
                        layer.msg('取消删除', {icon: 1});
                    });
                }


            },
            computed:{
                randomShow(){
                    return this.title != "视频编辑";
                }
            },
        });
        vm.videoShow =true;

    };

    function loadPublish(){
        let record = vm.record;
        if(!vm.record.id){
            vm.record.author = Number(localStorage.id?localStorage.id:0);
            if(vm.randomId != null){
                vm.record.author= vm.randomId;
            }
        }else{
            record = Object.assign({}, vm.record);
            delete (record['username']);
        }
        let data = articelService.publishArticle(record,vm.record_file);

        if(data && data.status == 'success') {
            layer.msg('发布成功',{icon:1});
            vm.videoShow = false;
        }else{
            layer.msg('发布失败,请重新发',{icon:2});
        }

    }
    function random(){
        let randomData = dummyService.getRandomChildUser();
        if(randomData && randomData.status == "success"){
            if(randomData.user == null) {
                vm.randomUsername = JSON.parse(localStorage.userData).username;

                vm.randomId = vm.record.author;
                return;
            }
            vm.randomUsername = randomData.user.username;
            vm.randomId = randomData.user.id;
        }
    }

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





