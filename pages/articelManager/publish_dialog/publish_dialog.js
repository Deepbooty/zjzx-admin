
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
    },
    shim: {
    }
});
define(["util","Vue","Vuex","Store","mapUtil","articelClassifyService","articelService","userService","dummyService"],function(util,Vue,Vuex,Store,mapUtil,articelClassifyService,articelService,userService,dummyService){
    var templateUrl =CONST.cdnpath +"/Backstage/pages/articelManager/publish_dialog/publish_dialog.html";
    let editor;
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
                dialogShow:true,
                randomUsername:"",
                randomId:null
            },
            mounted(){
                this.$nextTick(()=>{
                    // 获取随机名
                    random();
                    this.record.weight = 0;
                    /*获取classify文章类型接口*/
                    let calssifyData = articelClassifyService.getArticleClassifyList();
                    vm.classfyList = calssifyData.result.classfyList;

                    /*初始化编辑器--start*/
                    let toolbarOptions =[
                        ['bold','italic','underline','strike','blockquote','code-block','code'],
                        [{'header':1},{'header':2}],
                        [{'list':'ordered'},{'list':'bullet'}],
                        [{'script':'sub'},{'script':'super'}],
                        [{'indent':'-1'},{'indent':'+1'}],
                        [{'direction':'rtl'}],
                        [{'size':['small',false,'large','huge']}],
                        [{'header':[1,2,3,4,5,6,false]}],
                        [{'color':[]},{'background':[]}],
                        [{'font':[]}],
                        [{'align':[]}],
                        ['image','video','formula','clean','help']
                    ];
                    editor = new Quill("#editor",{
                        modules: {toolbar: toolbarOptions},
                        theme: "snow"
                    });

                    //let strContent = delHtmlTag(vm.record.content);
                    //
                 //   editor.setText(vm.record.content);
                  //  strContent = editor.container.firstChild.innerHTML;

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
                handleRandom(){
                    random();
                },
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
                        layer.tips('文章标题输入有误，请重新输入', '#titleTips');
                        return false;
                    }
                    else if(!vm.record.classify) {
                        layer.tips('文章分类选择有误，请重新选择','#classifyTips');
                        return false;
                    }
                    else if(editor.getLength() == 1) {
                        layer.tips('文章内容输入有误，请重新输入','#contentTips');
                        return false;
                    }
                    else{
                        loadPublish();
                    }
                },
                handleCancel(){
                    vm.dialogShow = false;
                }
            },
            computed:{
                randomShow(){
                    return this.title != "文章编辑";
                }
            },
        });
        vm.dialogShow =true;

    };

     function loadPublish(){
        let record = vm.record;
        if(!vm.record.id){
            vm.record.author = Number(localStorage.id?localStorage.id:0);
            vm.record.content = editor.container.firstChild.innerHTML;
            if(vm.randomId != null){
                vm.record.author= vm.randomId;
            }
        }else{
            record = Object.assign({}, vm.record);
            record.content = editor.container.firstChild.innerHTML;
            delete (record['username']);
        }
        let data = articelService.publishArticle(record,null);
        if(data && data.status == 'success') {
             layer.msg('发布成功',{icon:1});
//           vm.record.title = "";
//           vm.record.classify=0;
//           editor.deleteText(0,100000);
             vm.dialogShow = false;
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

    function delHtmlTag(str) {
        //return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
        return str.replace(/<(?!img).*?>/g,"");//去掉所有的html标记
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





