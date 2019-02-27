require.config({
    waitSeconds:0,
    paths:{
        "websiteService":CONST.cdnpath+"/Backstage/service/websiteService",
        "Vue":CONST.cdnpath+"/Backstage/js/vue.min",
        "Vuex":CONST.cdnpath+"/Backstage/js/vuex.min",
    },
    shim: {
    },
});
define(["websiteService","Vue","Vuex"],function(websiteService,Vue,Vuex){
    Vue.use(Vuex);
    let vm = new Vue({
        el:"#onlineApp",
        data:{
            tabToggle:false,
            dialogShow:false,
            recordList:[{
                id:'',
                membername:'',
                mobile:'',
                content:"",
                createtime :''
            }],
            pageObj:{
                page:1,
                size:10,
                keyword:'',
                totalPage:'',
                changePage:'',
                next(){
                    this.page++;
                    onlinePage();
                },
                prev(){
                    this.page--;
                    onlinePage();
                },
                reset(){
                    this.page = 1;
                }
            },
            modalItem:{}
        },
        computed:{
            showPage() {
                return this.pageObj.totalPage && this.pageObj.totalPage != 1;
                onlinePage();
            },
            /*TODO---省略号的显示隐藏

            *如果总页数<=7 省略号不显示
            如果总页数>5 省略号显示
            */
            showPointer() {
                if(this.pageObj.totalPage <= 7) return false;
                return this.pageObj.page > 5;
                onlinePage();
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
            handleDetail(item) {
                vm.dialogShow = true;
                vm.modalItem = item;
            },
            handleCancel(){
                vm.dialogShow = false;
            },
            // 分页跳转
            jumpPage(val) {
                //如果当前值大于总数或者当前值小于0 reture
                conPage(val);
                onlinePage();
            },
            jumpPageSure(val){
                if(!vm.pageObj.changePage){
                    layer.msg('请输入页码');
                    return false;
                }
                conPage(val);
                onlinePage();
            },

        },
        mounted(){
            this.$nextTick(()=>{
                onlinePage();
            })
        },
    });

    // 分页函数
    function onlinePage(){
        let params={
            page:vm.pageObj.page,
            size:vm.pageObj.size
        };
        let data = websiteService.getOnlinemessagePage(params);
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
});