require.config({
    waitSeconds:0,
    paths:{
        "articelService":CONST.cdnpath+"/Backstage/service/articelService",
        "articelClassifyService":CONST.cdnpath+"/Backstage/service/articelClassifyService",
        "Vue":CONST.cdnpath+"/Backstage/js/vue.min",
        "Vuex":CONST.cdnpath+"/Backstage/js/vuex.min",
        "Store":CONST.cdnpath+"/Backstage/store/index",
        "mapUtil":CONST.cdnpath+"/Backstage/util/mapUtil",
    },
    shim: {
    },
});
define(["articelService","articelClassifyService","Vue","Vuex","mapUtil"],function(articelService,articelClassifyService,Vue,Vuex,mapUtil){
    Vue.use(Vuex);
    let editor;
    let vm = new Vue({
        el:"#releaseApp",
        data:{
            userid:'',
            editor:'',
            classfyList:[],
            tip:{
                titleTip: '文章标题输入有误,请重新输入。',
                typeTip: '文章类型选择有误,请重新选择。',
                classifyTip: '文章分类选择有误,请重新选择。',
                contentTip: '文章内容输入有误,请重新输入。'
            },
            show:{
                titleShow:false,
                typeShow:false,
                classifyShow:false,
                contentShow:false
            },
            desc:{
                titleDesc:'',
                typeDesc:'',
                classifyDesc:'',
                contentDesc:''
            },
            record:{
                title:'',
                content:'',
                type:3,
                state:3,
                classify:0,
                author:{
                    type:Number,
                    default:1,
                },

            },
            record_file: []
        },
        mounted(){
            this.$nextTick(()=>{
                let calssifyData = articelClassifyService.getArticleClassifyList();
                this.classfyList = calssifyData.result.classfyList;
                //编辑器init()
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
                    this.record.treetnum = data.treetnum;
                });

            })

        },
        watch:{
            "record.title"(){
                if(vm.record.title) {
                    vm.show.titleShow = false;
                }else{
                    vm.show.titleShow = true;
                }
            },
            "record.type"(){
                if(vm.record.type) {
                    vm.show.typeShow = false;
                }else{
                    vm.show.typeShow = true;
                }
            },
            "record.classify"(){
                if(vm.record.classify) {
                    vm.show.classifyShow = false;
                }else{
                    vm.show.classifyShow = true;
                }
            },
        },
        directives:{
            focus: {
                inserted: function (el) {
                    el.focus()
                }
            }
        },
        methods:{
            //表单验证
            handleRelease(){
                let content = editor.container.firstChild.innerHTML;
                // vm.record.content = $('#editor').text();
                vm.record.content = content;
                let delta = editor.getContents();
                if(!vm.record.title) {
                    vm.show.titleShow = true;
                }
                else if(!vm.record.classify) {
                    vm.show.classifyShow = true;
                }
                else if(!vm.record.content) {
                    vm.show.contentShow = true;
                }
                else {

                    loadRelease();
                }
            },
        },
    });
    function loadRelease(){
        vm.record.author = Number(localStorage.id?localStorage.id:0);
       let data = articelService.publishArticle(vm.record,null);
        layer.msg('发布成功');
       if(data.status == 'success'){
           // vm.record.title ='';
           // vm.record.classify = 0;
           // editor.deleteText(0,100000);
           setTimeout(()=>{
               window.location.href="../articelManager/articelManager.html";
           },1500);

       }
    }

});