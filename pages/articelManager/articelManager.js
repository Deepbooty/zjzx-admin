require.config({
    waitSeconds:0,
    paths:{
        "articelService":CONST.cdnpath+"/Backstage/service/articelService",
        "articleFileService":CONST.cdnpath+"/Backstage/service/articleFileService",

        "userService":CONST.cdnpath+"/Backstage/service/userService",
        "dummyService":CONST.cdnpath+"/Backstage/service/dummyService",
        "Vue":CONST.cdnpath+"/Backstage/js/vue.min",
        "Vuex":CONST.cdnpath+"/Backstage/js/vuex.min",
        "Store":CONST.cdnpath+"/Backstage/store/index",
        "Tool":CONST.cdnpath+"/Backstage/js/methods",
        "publish_dialog":CONST.cdnpath+"/Backstage/pages/articelManager/publish_dialog/publish_dialog",
        "video_dialog":CONST.cdnpath+"/Backstage/pages/articelManager/video_dialog/video_dialog",
        "listUtil":CONST.cdnpath+"/Backstage/util/listUtil",


    },
    shim: {
    },
});
define(["articelService","articleFileService","userService","dummyService","Vue","Vuex","Store","Tool","publish_dialog","video_dialog","listUtil"],function(articelService,articleFileService,userService,dummyService,Vue,Vuex,Store,Tool,publish_dialog,video_dialog,listUtil){
    Vue.use(Vuex);
    // debugger;
    let vm = new Vue({
        el:"#articelApp",
        data:{
            fileRoot:CONST.fileRoot + '/',
            ArticleFile:[],
            keyword:"",
            state:1,
            //文章审核表格title
            // articelTitle:['序号','标题','内容','发布人','发布时间','发布地区','审核状态','操作'],
            modalItem:{},
            textDesc:"",
            hasError:false,
            dialogShow:true,
            videoShow:true,
            stateMap :{
                1:'正在审核',
                2:'人工审核',
                3:'审核通过',
                4:'审核不通过'
            },
            tabToggle:false,
            showDmodal:false,
            showReason:false,
            recordList:[],
            //分页信息
            pageObj: {
                page: 1,
                size: 10,
                state: 3,
                totalPage: '',
                changePage: '',
                next() {
                    this.page++;
                    loadRecordPage();
                },
                prev() {
                    this.page--;
                    loadRecordPage();
                },
                reset() {
                    this.page = 1;
                },
            },
        },
        // 过滤html标签
        filters:{
            msg: function(msg) {
                return msg.replace(/\n/g, "<br>") ;
            }
        },
        mounted(){
            this.$nextTick(()=>{
                loadRecordPage();
            });
        },
        computed:{
            showPage() {
                return this.pageObj.totalPage && this.pageObj.totalPage !=1;
                loadRecordPage();

            },
            /*TODO---省略号的显示隐藏

                 如果总页数<=7 省略号不显示
                 如果总页数>5 省略号显示
            * */
            showPointer(){
                if (this.pageObj.totalPage <= 7) return false;
                return this.pageObj.page > 5;
                loadRecordPage();
            },

            /*TODO---最后一个省略号的显示隐藏
                如果总页数==当前页，最后一个省略号隐藏
                反之亦然
           * */
            showLastPointer() {
                if(this.pageObj.totalPage == this.pageObj.page) {
                    return false;
                }else{
                    return true;
                }
            },

            /*TODO---下一页显示隐藏
                如果总页数等于当前页数，下一页隐藏
                如果总页数等于当前页数，下一页隐藏
                反之亦然
           * */
            showPrev() {
                if(this.pageObj.totalPage != this.pageObj.page) {
                    return true;
                }else{
                    return false;
                }
            },

            /*TODO---跳转页input的显示隐藏
                如果总页数<=7 隐藏
                反之亦然
           * */
            showTip(){
                if(this.pageObj.totalPage <= 7) {
                    return false;
                }else {
                    return true;
                }
            },

            /*TODO---判断当前的数字
           * */
            indexs() {
                let prev = 1, next = this.pageObj.totalPage, pageArr = [];
                if (this.pageObj.totalPage >= 7) {
                    if (this.pageObj.page > 5 && this.pageObj.page < this.pageObj.totalPage - 4) {
                        prev = Number(this.pageObj.page) - 3;
                        next = Number(this.pageObj.page) + 3;
                    } else {
                        if (this.pageObj.page <= 5) {
                            prev = 1;
                            next = 7;
                        } else {
                            next = this.pageObj.totalPage;

                            prev = this.pageObj.totalPage - 6;
                        }
                    }
                }
                while (prev <= next) {
                    pageArr.push(prev);
                    prev++;
                }
                return pageArr;
            },
        },
        methods:{
            //审核状态切换
            btnClick(val){
                vm.pageObj.reset();
                vm.pageObj.state = val;
                loadRecordPage();
                //判断--如果列表为空 暂无数据
                if(vm.recordList == "") {
                    vm.tabToggle = true;
                }else{
                    vm.tabToggle = false;
                }
                //判断--如果切换至审核不通过 未通过理由显示
                if(val == 4) {
                    vm.showReason = true;
                }else{
                    vm.showReason = false;
                }
            },
            // 文章发布
            handlePublish(){
                publish_dialog.open('#publish_dialog',{
                    title:'文章发布',
                    record:{
                        title:'',
                        content:'',
                        type:3,
                        state:3,
                        weight:0,
                        classify:0,
                        author:0
                    }
                })
            },
            // 视频发布
            handlePublishVideo(){
                video_dialog.open('#video_dialog',{
                    title:"视频发布",
                    record:{
                        title:'',
                        content:'',
                        type:2,
                        state:3,
                        weight:0,
                        classify:0,
                        author:0}
                    }
                )

            },
            // 搜索列表
            handleSearch(){
                if(!Tool.checkInput(vm.keyword)){
                    vm.keyword = Tool.replaceNo(vm.keyword);
                    layer.msg('搜索内容不合法，请重新搜索', {icon: 2},()=>{
                        $("#keywords").focus();
                    });
                    return;
                }
                vm.recordList = [];
                vm.pageObj.reset();
                loadRecordPage();

            },
            // 文章编辑
            handleImport(item){
                if(item.type == 2){
                    video_dialog.open("#video_dialog", {
                        title:"视频编辑",
                        record:item
                    })
                }else{
                    publish_dialog.open("#publish_dialog", {
                        title:"文章编辑",
                        record:item
                    })
                }

            },

            // 文章列表删除
            handleDelete(item){
                let data = articelService.deleteArticleById(item.id);
                if(data && data.status == "success"){
                    layer.confirm("确认删除这条文章列表?",{
                       btn:['确认','取消']
                    },function () {
                        layer.msg("删除成功",{icon:1});
                        vm.recordList.splice(item,1);
                        loadRecordPage();
                    },function () {
                        console.log('取消');
                    });

                }

            },
            // 分页跳转
            jumpPage(val) {
                //如果当前值大于总数或者当前值小于0 reture
                conPage(val);
                loadRecordPage();
            },
            jumpPageSure(val){
                if(!vm.pageObj.changePage){
                    layer.msg('请输入页码');
                    return false;
                }
                conPage(val);
                loadRecordPage();
            },

            // 查看详情
            handleClick(item) {
                vm.modalItem = item
            },

            //二次弹框--审核通过
            sure(item) {
                let data = articelService.articleCheck(item.id, 3,vm.checknoreason);
                if(data.status == 'success') {
                    layer.confirm('确认审核通过？', {
                        btn: ['确认','取消'] //按钮
                    }, ()=>{
                        layer.msg('审核已通过', {icon: 1});
                        loadRecordPage();
                    });
                }
            },
            cancel() {},
            // 审核理由提交
            submitResult(item){
                //判断如果textarea为空显示error
                if(this.textDesc == ""){
                    vm.hasError = true;
                    return false;
                }else{
                    vm.hasError=false;
                }

                item.checknoreason= vm.textDesc;
                let data = articelService.articleCheck(item.id, 4, item.checknoreason);
                if(data.status == "success") {
                    $('.dmodal,.modal-backdrop,#myModal').fadeOut();
                    layer.msg('提交成功', {icon: 1});
                    loadRecordPage();
                }


            },
        }
    });

    // 分页函数
    function loadRecordPage(){
        let articleData = articelService.articlePage(vm.pageObj.page,vm.pageObj.size,vm.keyword,vm.pageObj.state);
        if(articleData && articleData.status == "success"){
            vm.recordList = articleData.recordPage.list;
            listUtil.asyncSetListPropty(articleData.recordPage.list,(item)=>{
                // 获取用户名
               userService.getUserById(item.author, (data)=>{
                   if(data && data.status =="success"){
                       vm.$set(item, 'username',data.result.user.username);
                   }
               });
               // 获取视频封面
                articleFileService.getFileByArticle(item.id,(data)=>{
                   if(data && data.status == "success"){
                       if(item.type == 2){
                           vm.$set(item,'articleFile',data.result.filelist);
                       }
                   console.log(item)
                   }
                });

            });
            //分页---当前页reset
            let recordPageNum = articleData.recordPage.pageNumber;
            vm.pageObj.page = recordPageNum;

            //分页---总页数
            let recordTotalPage = articleData.recordPage.totalPage;
            vm.pageObj.totalPage = recordTotalPage;
            if(vm.recordList == '') {
                vm.tabToggle = true;
            }else{
                vm.tabToggle=false;
            }
        }

    }
    function conPage(val) {
        if(val > vm.pageObj.totalPage || val < 0){
            layer.alert('请输入正确页码', {icon: 2});
            vm.pageObj.changePage="";
            return false;
        }else{
            vm.pageObj.page = val;
        }
    }
    $(function(){
        $('#notGoBtn').click(function(){
            $('.dmodal').fadeIn()
        });
        $('.dmodal-close,.mask').click(function(){
            $('.dmodal').fadeOut()
        });

    })
});
