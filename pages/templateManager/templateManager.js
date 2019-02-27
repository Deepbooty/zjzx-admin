require.config({
    waitSeconds:0,
    paths:{
        "templateService":CONST.cdnpath+"/Backstage/service/templateService",
        "Vue":CONST.cdnpath+"/Backstage/js/vue.min",
        "Vuex":CONST.cdnpath+"/Backstage/js/vuex.min",
        "Store":CONST.cdnpath+"/Backstage/store/index",
        "publish_dialog":CONST.cdnpath+"/Backstage/pages/articelRelease/publish_dialog/publish_dialog",

    },
    shim: {
    },
});
define(["templateService","Vue","Vuex","Store","publish_dialog"],function(templateService,Vue,Vuex,Store,publish_dialog){
    Vue.use(Vuex);
    let vm = new Vue({
        el:"#tempManager",
        data:{
            id:'',
            userid:'',
            dialogTit:'',
            descValue:'',
            titValue:'',
            contValue:'',
            recordid:"",
            typeMap:{
              1:'审核理由'
            },
            typeModel:'',
            dialogShow:false,
            tabToggle:false,
            addShow:false,
            editShow:false,
            error: {descError:"", titError:"", contError:"",typeError:""},
            tempTitle:{
                id:'序号',
                title:'标题',
                discription:'描述',
                content:'内容',
                userid:'创建人',
                type:'类型',
                createtime:'创建时间',
                handle:'操作'
            },
            recordList:[{id: "", title: "", discription: "", content: "", userid: "", createtime: ""}],
            editList:{},
            pageObj:{
                page:1,
                size:10,
                type:'',
                keyword:'',
                totalPage:'',
                changePage:'',
                next(){
                    this.page++;
                    templatePage();
                },
                prev(){
                    this.page--;
                    templatePage();
                },
                reset(){
                    this.page = 1;
                }
            },
        },
        mounted(){
            this.$nextTick(()=>{
                templatePage();
            })

        },
        computed:{
           showPage() {
                return this.pageObj.totalPage && this.pageObj.totalPage != 1;
                importPage();
            },
            /*TODO---省略号的显示隐藏

            *如果总页数<=7 省略号不显示
            如果总页数>5 省略号显示
            */
            showPointer() {
                if(this.pageObj.totalPage <= 7) return false;
                return this.pageObj.page > 5;
                importPage();
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
            //新建---编辑---删除
            handleAdd(){

                vm.dialogShow = true;
                vm.dialogTit = "新建模板";
                /**vm.error.descError = "";
                vm.error.titError = "";
                vm.error.contentError = "";
                vm.error.typeError = "";
                vm.editList= {};**/
            	// publish_dialog.open("#publish_dialog",{
            	// 	title:"新建模板",
            	// 	record:{
            	// 		title:"阿萨德"
            	// 	},
            	// 	error:{}
            	// },function(data){
            	// 	alert(data.record.title);
            	// });
            },
            handleEdit(item){
                vm.dialogShow = true;
                vm.dialogTit = "编辑模板";
                vm.editList = item;
            },
            handleDelete(item){
                let data =templateService.deleteTemplate(item.id);
                if(data && data.status == 'success') {
                    layer.confirm('确认删除模板？', {
                        btn: ['确认','取消'] //按钮
                    },()=>{
                        layer.msg('删除成功', {icon: 1});
                        vm.recordList.splice(item,1);
                        if(vm.recordList.length <= 0) {
                            vm.tabToggle = true;
                            if(vm.pageObj.size > 1) {
                                vm.pageObj.page--;
                            }
                        }
                    });
                }


            },

            //取消弹框
            cancel() {
                vm.dialogShow = false;

            },
            //提交按钮
            sure(){
                if(!vm.editList.title) {
                    vm.error.titError = "模板标题输入有误，请重新输入！";
                    return false;
                }
                vm.error.titError = "";
                if(!vm.editList.discription) {
                    vm.error.descError = "模板描述输入有误，请重新输入！";
                    return false;
                }
                vm.error.descError = "";
                if(!vm.editList.content) {
                    vm.error.contError = "模板内容输入有误，请重新输入！";
                    return false;
                }
                vm.error.contError = "";
                if(!vm.editList.type) {
                    vm.error.typeError = "审核类型选择错误，请重新选择！";
                    return false;
                }
                vm.error.typeError = "";
                templateService.saveTemplate(vm.editList);
                templatePage();
                vm.dialogShow = false;

            },
            // 分页跳转
            jumpPage(val) {
                //如果当前值大于总数或者当前值小于0 reture
                conPage(val);
                templatePage();
            },
            jumpPageSure(val){
                if(!vm.pageObj.changePage){
                    layer.msg('请输入页码');
                    return false;
                }
                conPage(val);
                templatePage();
            },
            open2() {
                this.$message({
                    message: '恭喜你，这是一条成功消息',
                    type: 'success'
                });
            },

        }
    });

    function templatePage () {
        let params = {
            page:vm.pageObj.page,
            size:vm.pageObj.size,
            type:1,
            keyword:""
        };
        let data = templateService.templatePage(params);
        console.log(data);
        let recordList = data.recordPage.list;
        vm.recordList = recordList;
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
    function conPage(val) {
        if(val > vm.pageObj.totalPage || val < 0){
            layer.alert('请输入正确页码', {icon: 2});
            vm.pageObj.changePage="";
            return false;
        }else{
            vm.pageObj.page = val;
        }
    }
});