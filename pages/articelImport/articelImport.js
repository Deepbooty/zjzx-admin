require.config({
    waitSeconds:0,
    paths:{
        "articelImportService":CONST.cdnpath+"/Backstage/service/articelImportService",
        "Vue":CONST.cdnpath+"/Backstage/js/vue.min",
        "Vuex":CONST.cdnpath+"/Backstage/js/vuex.min",
        "Store":CONST.cdnpath+"/Backstage/store/index",
        "publish_dialog":CONST.cdnpath+"/Backstage/pages/articelManager/publish_dialog/publish_dialog",
    },
    shim: {
    },
});
define(["articelImportService","Vue","Vuex","Store","publish_dialog"],function(articelImportService,Vue,Vuex,Store,publish_dialog){
    Vue.use(Vuex);
    let vm = new Vue({
        el:"#importApp",
        data:{
            tabToggle:false,
            dialogShow:true,
            importTitle:{
                id:'序号',
                title:'标题',
                content:'内容',
                source:'文章来源',
                publishtime:'发布时间',
                discription:'描述',
                href:'原文地址',
                handle:'操作'
            },
            recordList:[{
                id:'',
                title:'',
                content:'',
                source:'',
                publishtime: '',
                discription: '',
                href: ''
            }],
            pageObj:{
                page:1,
                size:10,
                keyword:'',
                totalPage:'',
                changePage:'',
                next(){
                    this.page++;
                    importPage();
                },
                prev(){
                    this.page--;
                    importPage();
                },
                reset(){
                    this.page = 1;
                }
            }
        },
        mounted(){
            this.$nextTick(()=>{
                importPage();
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
            //文章导入
            handleImport(item){
                publish_dialog.open("#publish_dialog",{
                    title:'文章导入',
                	record:{
                		title:item.title,
                        content:item.content,
                        sourceurl:item.href,
                        type:3,
                        state:3,
                        classify:0,
                        author:{
                            type:Number,
                            default:1
                        }
                	},
                	error:{}
                });
            },

            //单条新闻删除
            handleDelete(item){
                let data = articelImportService.deleteArticle(item.id);
                if(data.status == 'success') {
                    layer.confirm('确认删除新闻？', {
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


            // 分页跳转
            jumpPage(val) {
                //如果当前值大于总数或者当前值小于0 reture
                conPage(val);
                importPage();
            },
            jumpPageSure(val){
                if(!vm.pageObj.changePage){
                    layer.msg('请输入页码');
                    return false;
                }
                conPage(val);
                importPage();
            },
        }
    });
    function importPage() {
        let params = {
            page:vm.pageObj.page,
            size:vm.pageObj.size,
            keyword:""
        };
        let data = articelImportService.getArticleList(params);
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