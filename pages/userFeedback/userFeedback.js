require.config({
    waitSeconds:0,
    paths:{
        "feedbackService":CONST.cdnpath+"/Backstage/service/feedbackService",
        "Vue":CONST.cdnpath+"/Backstage/js/vue.min",
        "Vuex":CONST.cdnpath+"/Backstage/js/vuex.min",
        "Store":CONST.cdnpath+"/Backstage/store/index",
        "listUtil":CONST.cdnpath+"/Backstage/util/listUtil"
    },
    shim: {
    },
});
define(["feedbackService","Vue","Vuex","Store","listUtil"],function(feedbackService,Vue,Vuex,Store,listUtil){
    Vue.use(Vuex);
    // debugger;
    let vm = new Vue({
        el:"#feedbackApp",
        data:{
            tabToggle:false,
            altDesc:'反馈图片未上传...',
            textDesc:'',
            recordList:[{
                id:'',
                content:'',
                image:'',
                createtime :''
            }],
            recordid:'',
            pageObj:{
                page:1,
                size:10,
                totalPage:'',
                changePage:'',
                next(){
                    this.page++;
                    feedbackPage();
                },
                prev(){
                    this.page--;
                    feedbackPage();
                },
                reset(){
                    this.page=1;
                }
            },
            replyList:{
                feedid:'',
                replyContent:''
            },
             modalItem:{},
        },
   
        mounted(){
         this.$nextTick(()=>{
            feedbackPage();
         })

        },
        computed:{
            showPage() {
                return this.pageObj.totalPage && this.pageObj.totalPage != 1;
                feedbackPage();
            },
            /*TODO---省略号的显示隐藏

            *如果总页数<=7 省略号不显示
            如果总页数>5 省略号显示
            */
            showPointer() {
                if(this.pageObj.totalPage <= 7) return false;
                return this.pageObj.page > 5;
                feedbackPage();
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
            // 反馈详情
            handleDetail(item) {
                console.log(item);
                vm.modalItem = item;
            },
            // 反馈回复
            handleSure(item) {
                if(vm.textDesc == ""){
                     layer.tips('回复反馈内容有误,请重新输入！', '#details');
                     return;
                }
                let params = {
                    feedid:item.id,
                    replyContent: vm.textDesc
                };
                let replyData = feedbackService.reply(params);
                if(replyData.status == 'success') {
                    layer.msg('提交成功', {icon: 1});
                    $('.dmodal,.modal-backdrop,#detailModal').fadeOut();
                }
            },
            // 分页跳转
            jumpPage(val) {
                //如果当前值大于总数或者当前值小于0 reture
                conPage(val);
                feedbackPage();
            },
            jumpPageSure(val){
                if(!vm.pageObj.changePage){
                    layer.msg('请输入页码');
                    return false;
                }
                conPage(val);
                feedbackPage();
            },

        }
    });

    // 分页函数
    function feedbackPage(){
       let params={
        page:vm.pageObj.page,
        size:vm.pageObj.size
       };
       let data = feedbackService.getFeedBackPage(params);
       let recordList = data.recordPage.list;
       listUtil.asyncSetListPropty(recordList,(item)=>{
           let imageData = feedbackService.getFeedImage(item,function(_this,imageData){
                if(!imageData.image) {
                    vm.imgShow = true;
                    return;
                 }
                Vue.set(_this,"image",imageData.image);


           });
          
       });

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
    $(function(){
        $('#notGoBtn').click(function(){
            $('.dmodal').fadeIn()
        });
        $('.dmodal-close,.mask').click(function(){
            $('.dmodal').fadeOut()
        });

    })
});