require.config({
    waitSeconds:0,
    paths:{
        "websiteService":CONST.cdnpath+"/Backstage/service/websiteService",
        "Vue":CONST.cdnpath+"/Backstage/js/vue.min",
        "Vuex":CONST.cdnpath+"/Backstage/js/vuex.min",
        "Store":CONST.cdnpath+"/Backstage/store/index",
        "util": CONST.cdnpath+"/Backstage/js/util",
        "listUtil":CONST.cdnpath+"/Backstage/util/listUtil",
    },
    shim: {
    },
});

define(["websiteService","Vue","Vuex","Store","util","listUtil"],function(websiteService,Vue,Vuex,Store,util,listUtil){
    Vue.use(Vuex);
    let vm = new Vue({
        el:"#newsApp",
        data:{
            tabToggle:false,
            recordList:[{
                creatorid:'',
                title:'',
                content:'',
                imagepath:'',
                createtime:'',
                id:""
            }],
            dialogTit:'',
            altDesc:'图片未上传',
            fileRoot:CONST.fileRoot + '/',
            dialogShow:false,
            dialogTit:'',
            imgShow:false,
            setShow:false,
            saveShow:false,
            recordObj:{
                title:'',
                content:'',
                imagepath:''
            },
            error: {titError:"", descError:"", imageError:""},
            pageObj:{
                page:1,
                size:10,
                keyword:'',
                totalPage:'',
                changePage:'',
                next(){
                    this.page++;
                   infoPage();
                },
                prev(){
                    this.page--;
                    infoPage();
                },
                reset(){
                    this.page = 1;
                }
            }
        },

        mounted(){
            this.$nextTick(()=>{
                infoPage();
            })

        },
        computed:{
            showPage() {
                return this.pageObj.totalPage && this.pageObj.totalPage != 1;
                infoPage();
            },
            /*TODO---省略号的显示隐藏

            *如果总页数<=7 省略号不显示
            如果总页数>5 省略号显示
            */
            showPointer() {
                if(this.pageObj.totalPage <= 7) return false;
                return this.pageObj.page > 5;
                infoPage();
            },

            /*TODO---最后一个省略号的显示隐藏
            如果总页数==当前页，最后一个省略号隐藏
            反之亦然
            */
            showLastPointer() {
                if(this.pageObj.totalPage == this.pageObj.page) {
                    return false;
                }else {
                    return true;
                }
            },
            /*TODO---下一页显示隐藏
            如果总页数等于当前页数，下一页隐藏
            反之亦然*/
            showPrev() {
                if(this.pageObj.totalPage != this.pageObj.page) {
                    return true;
                }else {
                    return false;
                }
            },
            /*TODO---跳转页input的显示隐藏
            如果总页数<=7 隐藏
            反之亦然*/
            showTip() {
                if(this.pageObj.totalPage <= 7) {
                    return false;
                }else {
                    return true;
                }
            },
            /*TODO---判断当前数字*/

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
            // 打开弹框
            handleAdd(){
              vm.dialogTit = "新闻发布";
              vm.setShow = true;
              vm.saveShow = false;
              vm.dialogShow = true;
            },

            // 取消弹框
            handleCancel(val){
                vm.dialogShow = false;
                if(val == 1) {
                    setTimeout(()=>{
                        handleReset();
                    },1200);
                }else{

                }

            },
            // 发布新闻
            handleSendNews(val){
                if(!vm.recordObj.title){
                    vm.error.titError = "新闻标题输入有误，请重新输入！";
                    return false;
                }
                vm.error.titError = "";
                if(!vm.recordObj.content){
                    vm.error.descError = "新闻内容输入有误，请重新输入！";
                    return false;
                }
                vm.error.descError = "";
                if(!vm.recordObj.imagepath){
                    vm.error.imageError = "新闻图片上传有误，请重新上传！";
                    return false;
                }
                vm.error.imageError = "";
                if(val == 1){
                    websiteService.setInformation(vm.recordObj.title,vm.recordObj.content,vm.recordObj.imagepath);
                    infoPage();
                    vm.dialogShow = false;
                }else{
                    websiteService.setInformation(vm.recordObj.title,vm.recordObj.content,vm.recordObj.imagepath,vm.recordObj.id);
                    infoPage();
                    vm.dialogShow = false;
                }

            },
            // 编辑新闻
            handleEdit(item){
                vm.imgShow = true;
                vm.dialogShow = true;
                vm.saveShow=true;
                vm.setShow=false;
                vm.dialogTit = "新闻编辑";
                vm.recordObj = item;
            },
            // 删除资讯
            handleDelete(item){
                let data =websiteService.deleteInformation(item.id);
                if(data && data.status == "success"){
                    layer.confirm('确认删除资讯？', {
                        btn: ['确认','取消'] //按钮
                    },()=>{
                        layer.msg('删除成功', {icon: 1});
                        vm.recordList.splice(item,1);
                        infoPage();
                        if(vm.recordList.length <= 0) {
                            vm.tabToggle = true;
                            if(vm.pageObj.size > 1) {
                                vm.pageObj.page--;
                            }
                        }
                    });
                }
            },
            // 分页跳转
            jumpPage(val) {
                //如果当前值大于总数或者当前值小于0 reture
                conPage(val);
                infoPage();
            },
            jumpPageSure(val){
                if(!vm.pageObj.changePage){
                    layer.msg('请输入页码');
                    return false;
                }
                conPage(val);
                infoPage();
            },
        }
    });
    function infoPage(){
        let params = {
            page:vm.pageObj.page,
            size:vm.pageObj.size,
            keyword:""
        };
        let data = websiteService.getInformationPage(params);
        if(data && data.status == "success"){
            vm.recordList = data.recordPage.list;
            //分页---当前页
            let recordPageNum = data.recordPage.pageNumber;
            vm.pageObj.page = recordPageNum;
            //分页---总页数
            let recordTotalPage = data.recordPage.totalPage;
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
    function handleReset(){
        vm.recordObj.title ="";
        vm.recordObj.content ="";
        vm.recordObj.imagepath ="";
        vm.error.titError = "";
        vm.error.descError = "";
        vm.error.imageError = "";
        vm.imgShow = false;
    }
    $("#btn").click(function() {
        var filebtn = $("input[type=file]");
        filebtn.change(function() {
            var filedata = $(this)[0].files[0];
            let fileFormData = new FormData();
            fileFormData.append('file', filedata, filedata.name);

            $.ajax({
                url: CONST.fileServer + "/file/uploadPic",
                type: 'post',
                dataType: 'json',
                data: fileFormData,
                async: true,
                processData: false,
                contentType: false,
                success: function(res) {
                   /* var image = $("<img />")
                    image.attr("src",CONST.fileRoot+"/"+res.result.url);
                    image.css({"width":"500px","height":"300px"})
                    $(".news-img").html(image);*/
                    vm.recordObj.imagepath = res.result.url;
                    vm.imgShow = true;
                }
            })

        }).click();
    })


});